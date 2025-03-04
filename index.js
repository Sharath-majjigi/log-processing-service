import express from 'express';
import multer from 'multer';
import { logProcessingQueue } from './log-processing-queue.js';
import { supabase } from './supabaseClient.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const fileId = Date.now().toString();
  await logProcessingQueue.add('processLogFile', {
    fileId,
    filePath: req.file.path
  });

  res.json({ message: 'File uploaded', jobId: fileId });
});


app.get('/queue-status', async (req, res) => {
    try {
      const activeJobs = await logProcessingQueue.getActiveCount();
      const waitingJobs = await logProcessingQueue.getWaitingCount();
      const failedJobs = await logProcessingQueue.getFailedCount();
  
      res.json({ activeJobs, waitingJobs, failedJobs });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch queue status' });
    }
  });


  app.get('/stats', async (req, res) => {
    try {
      const { data, error } = await supabase.from('log_stats').select('*');
  
      if (error) throw error;
  
      res.json(data);
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ error: 'Failed to fetch log stats' });
    }
  });

app.listen(3000, () => console.log('Server running on port 3000'));
