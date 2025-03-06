import { Worker } from 'bullmq';
import Redis from 'ioredis';
import axios from 'axios'; // Import axios to fetch the file content
import { supabase } from '../services/supabaseClient.js';
import dotenv from 'dotenv';

dotenv.config();

// Ensure Redis connection allows BullMQ processing
const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const redisPublisher = new Redis(process.env.REDIS_URL);

export const worker = new Worker(
  process.env.QUEUE_NAME,
  async (job) => {
    const { fileId, filePath } = job.data; 

    try {
      console.log(`Processing job: ${job.id} | File: ${job.data.filePath}`);
      const stats = { errors: 0, keywords: {}, ips: new Set() };

      // Fetch the file content from Supabase Storage
      const response = await axios.get(filePath, { timeout: 10000 }); 
      const fileContent = response.data; 

      // Split the file content into lines
      const lines = fileContent.split('\n');

      for (const line of lines) {
        if (line.includes('ERROR')) stats.errors++;
        const ipMatch = line.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
        if (ipMatch) stats.ips.add(ipMatch[0]);
      }
      
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
    } catch (err) {
      console.error("Worker error:", err.message);
      redisPublisher.publish(REDIS_EVENT, JSON.stringify({ jobId: fileId, status: 'failed', error: err.message }));

    }
  },
  { connection, concurrency: 4 }
);

console.log('Worker started...');