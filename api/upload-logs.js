import { logProcessingQueue } from '../../lib/log-processing-queue';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const form = new formidable.IncomingForm();
  
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error processing file' });

    const filePath = files.file[0].filepath;
    const fileId = Date.now().toString(); // Unique ID

    await logProcessingQueue.add('processLogFile', { fileId, filePath }, { priority: files.file[0].size });

    return res.status(200).json({ message: 'File uploaded', jobId: fileId });
  });
}
