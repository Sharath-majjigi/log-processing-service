import express from 'express';
import multer from 'multer';
import { supabase } from '../../services/supabaseClient.js';
import { logProcessingQueue } from '../../queue/logQueue.js';
import dotenv from 'dotenv';

const router = express.Router();
const upload = multer(); 

router.post('/', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    // Upload the file to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
        .from('log-files') 
        .upload(`uploads/${file.originalname}`, file.buffer, {
            contentType: file.mimetype,
            upsert: true 
        });

        console.log('Upload data:', data);

    if (uploadError) {
        return res.status(500).json({ error: 'Error uploading file to Supabase', details: uploadError.message });
    }

   const publicURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/log-files/uploads/${file.originalname}`;


    // Log the job data before adding it to the queue
    console.log('Adding job to queue:', {
        fileId: Date.now().toString(),
        filePath: publicURL, // Ensure this is set correctly
    });

    // Add job to the processing queue
    const job = await logProcessingQueue.add('processLogFile', {
        fileId: Date.now().toString(),
        filePath: publicURL, // Use the public URL for processing
    });

    res.json({ message: 'File uploaded', jobId: job.data.fileId, fileUrl: publicURL });
});

export default router;
