import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const connection = new Redis(process.env.REDIS_URL);

export const logProcessingQueue = new Queue(process.env.QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 3, // Retry failed jobs 3 times
    removeOnComplete: true,
    removeOnFail: false,
  }
});
