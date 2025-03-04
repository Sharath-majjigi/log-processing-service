import { Queue } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL);

export const logProcessingQueue = new Queue('log-processing-queue', {
  connection,
  defaultJobOptions: {
    attempts: 3, // Retry failed jobs 3 times
    removeOnComplete: true,
    removeOnFail: false,
    maxRetriesPerRequest: null
  }
});
