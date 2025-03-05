import { Queue } from 'bullmq';
import { redisClient } from '../services/redisClient.js';

export const logProcessingQueue = new Queue('log-processing-queue', {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
  },
});
