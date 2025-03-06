import { Queue } from 'bullmq';
import { redisClient } from '../services/redisClient.js';
import { QUEUE_NAME } from '../config/env.js'

export const logProcessingQueue = new Queue(QUEUE_NAME, {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
  },
});
