import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { redisClient } from '../services/redisClient.js';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { supabase } from '../services/supabaseClient.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const connection = redisClient;
const redisPublisher = redisClient;
const pipelineAsync = promisify(pipeline);

export const worker = new Worker(
  'log-processing-queue',
  async (job) => {
    const { fileId, filePath } = job.data;

    try {
      console.log(`Processing job: ${job.id} | File: ${filePath}`);
      const stats = { errors: 0, keywords: {}, ips: new Set() };

      // Fetch the file content from Supabase Storage
      const response = await axios.get(filePath, { responseType: 'stream' });
      const stream = response.data;

      // Process the stream
      stream.on('data', (chunk) => {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
          if (line.includes('ERROR')) stats.errors++;
          const ipMatch = line.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
          if (ipMatch) stats.ips.add(ipMatch[0]);
        }
      });

      stream.on('end', async () => {
        console.log(`Inserting into Supabase: JobID=${fileId}, Errors=${stats.errors}, IPs=${[...stats.ips]}`);

        const { data, error } = await supabase.from('log_stats').insert([
          {
            job_id: fileId,
            errors: stats.errors,
            unique_ips: [...stats.ips],
          }
        ]).select();

        const REDIS_EVENT = process.env.REDIS_EVENT;
        if (error) {
          console.error("Supabase Insert Error:", error.message);
          redisPublisher.publish(REDIS_EVENT, JSON.stringify({ jobId: fileId, status: 'failed', error: error.message }));
        } else {
          console.log(`Data inserted into Supabase for job: ${fileId}`);
          redisPublisher.publish(REDIS_EVENT, JSON.stringify({ jobId: fileId, status: 'completed', result: { errors: stats.errors, unique_ips: [...stats.ips] } }));
        }
      });

      stream.on('error', (err) => {
        console.error("Stream error:", err.message);
        redisPublisher.publish(REDIS_EVENT, JSON.stringify({ jobId: fileId, status: 'failed', error: err.message }));
      });

    } catch (err) {
      console.error("Worker error:", err.message);
      redisPublisher.publish(REDIS_EVENT, JSON.stringify({ jobId: fileId, status: 'failed', error: err.message }));
    }
  },
  { connection, concurrency: 4 }
);

console.log('Worker started...');