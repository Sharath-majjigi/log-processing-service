import bullmq from 'bullmq';
import express from 'express';
import { redisClient } from '../../services/redisClient.js';
import {QUEUE_NAME} from '../../config/env.js'

const { Queue } = bullmq;

const router = express.Router();
const logQueue = new Queue(QUEUE_NAME, { connection: redisClient });

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
