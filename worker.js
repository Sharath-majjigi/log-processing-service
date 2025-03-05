import { Worker } from 'bullmq';
import Redis from 'ioredis';
import axios from 'axios';
import { supabase } from './src/services/supabaseClient.js';

const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  'log-processing-queue',
  async (job) => {
    try {
      console.log(`Processing job: ${job.id} | File: ${job.data.filePath}`);

      const { fileId, filePath } = job.data; 
      const stats = { errors: 0, keywords: {}, ips: new Set() };

      // Fetch the file content from Supabase Storage
      const response = await axios.get(filePath);
      const fileContent = response.data;

      const lines = fileContent.split('\n');


      for (const line of lines) {
        if (line.includes('ERROR')) stats.errors++;
        const ipMatch = line.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
        if (ipMatch) stats.ips.add(ipMatch[0]);
      }

      console.log(`Job completed: ${fileId} | Errors: ${stats.errors} | IPs: ${[...stats.ips]}`);
      
      console.log(`Inserting into Supabase: JobID=${fileId}, Errors=${stats.errors}, IPs=${[...stats.ips]}`);

      const { data, error } = await supabase.from('log_stats').insert([
        {
          job_id: fileId,
          errors: stats.errors,
          unique_ips: [...stats.ips],
        }
      ]).select();

      if (error) {
        console.error("Supabase Insert Error:", error.message);
      } else {
        console.log(`Data inserted into Supabase for job: ${fileId}`);
      }
    } catch (err) {
      console.error("Worker error:", err.message);
    }
  },
  { connection, concurrency: 4 }
);

console.log('🚀 Worker started...');