import { Queue } from 'bullmq';
import { redisClient } from '../services/redisClient.js';
import dotenv from 'dotenv';

dotenv.config();

export const logProcessingQueue = new Queue(process.env.QUEUE_NAME, {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
  },
});
