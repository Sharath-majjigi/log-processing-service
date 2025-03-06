import bullmq from 'bullmq';
import express from 'express';
import { redisClient } from '../../services/redisClient.js';
import dotenv from 'dotenv';

dotenv.config();

const { Queue } = bullmq;

const router = express.Router();
const logQueue = new Queue(process.env.QUEUE_NAME, { connection: redisClient });

router.get('/', async (req, res) => {
  try {
    const waiting = await logQueue.getWaitingCount();
    const active = await logQueue.getActiveCount();
    const failed = await logQueue.getFailedCount();

    res.json({ activeJobs: active, waitingJobs: waiting, failedJobs: failed });
  } catch (err) {
    console.error('Error fetching queue status:', err.message);
    res.status(500).json({ error: 'Failed to fetch queue status' });
  }
});

export default router;
