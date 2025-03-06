import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import {QUEUE_NAME} from './src/config/env.js'

const connection = new Redis(process.env.REDIS_URL);

export const logProcessingQueue = new Queue(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 3, // Retry failed jobs 3 times
    removeOnComplete: true,
    removeOnFail: false,
  }
});
