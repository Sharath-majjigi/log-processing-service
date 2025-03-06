import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { Queue } from 'bullmq';
import { redisClient } from '../services/redisClient.js';
import { supabase } from '../services/supabaseClient.js';
import { QUEUE_NAME } from '../config/env.js';

/**
 * Processes a log file and splits it into chunks for concurrent processing.
 * @param {string} fileId - Unique ID for the job.
 * @param {string} filePath - Path to the log file.
 */
export async function processLogs(fileId, filePath) {
    try {
      const absolutePath = path.resolve(filePath);
      console.log(`Processing log file: ${absolutePath}`);
  
      if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        return;
      }
  
      const queue = new Queue(QUEUE_NAME, { connection: redisClient });
      const chunkSize = 1000;
      let currentChunk = [];
      let chunkCount = 0;
  
      const fileStream = fs.createReadStream(absolutePath, { encoding: 'utf-8' });
      const rl = readline.createInterface({ input: fileStream });
  
      // Read file and create chunks
      for await (const line of rl) {
        currentChunk.push(line);
        if (currentChunk.length >= chunkSize) {
          chunkCount++;
          console.log(`Chunk ${chunkCount} created.`);
          
          // Add job to queue with retry options
          await queue.add(
            'process-chunk',
            { fileId, filePath, chunk: currentChunk},
            {
              attempts: 3, // Retry 3 times
              backoff: 5000, // Retry after 5 seconds
              removeOnComplete: true,
              removeOnFail: true
            }
          );
          currentChunk = [];
        }
      }
  
      if (currentChunk.length > 0) {
        chunkCount++;
        console.log(`Chunk ${chunkCount} created.`);
        await queue.add(
          'process-chunk',
          { fileId, filePath, chunk: currentChunk },
          {
            attempts: 3, 
            removeOnComplete: true,
            removeOnFail: true
          }
        );
      }
  
      console.log(`Log file split into ${chunkCount} chunks and jobs enqueued.`);
    } catch (err) {
      console.error("Log processing error:", err.message);
    }
  }


/**
 * Processes a chunk of log file and stores stats in Supabase.
 * @param {string} fileId - The unique job ID.
 * @param {Array} chunk - The log lines to process.
 */
export async function processLogChunk(fileId, chunk) {
    const stats = { errors: 0, keywords: {}, ips: new Set() };
    const keywordList = process.env.KEYWORDS ? process.env.KEYWORDS.split(',') : [];
  
    // Process each line in the chunk
    for (const line of chunk) {
      if (line.includes('ERROR')) stats.errors++;
  
      // Extract IPs (IPv4 format)
      const ipMatch = line.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
      if (ipMatch) stats.ips.add(ipMatch[0]);
  
      // Extract custom keywords
      for (const keyword of keywordList) {
        if (line.includes(keyword)) {
          stats.keywords[keyword] = (stats.keywords[keyword] || 0) + 1;
        }
      }
    }
  
    console.log(`Processed chunk for fileId ${fileId} | Errors: ${stats.errors} | IPs: ${[...stats.ips]}`);
  
    // Insert processed stats into Supabase
    const { error } = await supabase.from('log_stats').insert([
      {
        job_id: fileId,
        errors: stats.errors,
        unique_ips: [...stats.ips],
        keywords: stats.keywords
      }
    ]);
  
    if (error) {
      console.error("Supabase Insert Error:", error.message);
    } else {
      console.log(`Data successfully inserted into Supabase for job: ${fileId}`);
    }
  }
