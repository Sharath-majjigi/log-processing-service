import { Worker } from 'bullmq';
import Redis from 'ioredis';
import fs from 'fs';
import readline from 'readline';
import { supabase } from './supabaseClient.js';

// Ensure Redis connection allows BullMQ processing
const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  'log-processing-queue',
  async (job) => {
    try {
      console.log(`🔄 Processing job: ${job.id} | File: ${job.data.filePath}`);

      const { fileId, filePath } = job.data;
      const stats = { errors: 0, keywords: {}, ips: new Set() };

      if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        return;
      }

      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({ input: fileStream });

      for await (const line of rl) {
        if (line.includes('ERROR')) stats.errors++;
        const ipMatch = line.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
        if (ipMatch) stats.ips.add(ipMatch[0]);
      }

      console.log(`✅ Job completed: ${fileId} | Errors: ${stats.errors} | IPs: ${[...stats.ips]}`);
      
      // 🚀 LOG before inserting into Supabase
      console.log(`📝 Inserting into Supabase: JobID=${fileId}, Errors=${stats.errors}, IPs=${[...stats.ips]}`);

      const { data, error } = await supabase.from('log_stats').insert([
        {
          job_id: fileId,
          errors: stats.errors,
          unique_ips: [...stats.ips],
        }
      ]).select(); // 🚀 Ensure we fetch the inserted row

      if (error) {
        console.error("❌ Supabase Insert Error:", error.message);
      } else {
        console.log(`📊 Data inserted into Supabase for job: ${fileId}`);
      }
    } catch (err) {
      console.error("❌ Worker error:", err.message);
    }
  },
  { connection, concurrency: 4 }
);

console.log('🚀 Worker started...');
