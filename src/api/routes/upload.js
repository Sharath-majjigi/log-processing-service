// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import { logProcessingQueue } from '../../queue/logQueue.js';

// const router = express.Router();
// const upload = multer({ dest: 'uploads/' });

// router.post('/', upload.single('file'), async (req, res) => {
//     const file = req.file;
//     if (!file) return res.status(400).json({ error: 'No file uploaded' });

//     const absoluteFilePath = path.resolve(file.path); // ✅ Ensure absolute path

//     const job = await logProcessingQueue.add('processLogFile', {
//         fileId: Date.now().toString(),
//         filePath: absoluteFilePath,
//     });

//     res.json({ message: 'File uploaded', jobId: job.data.fileId });
// });

// export default router;

import express from 'express';
import multer from 'multer';
import { supabase } from '../../services/supabaseClient.js'; // Ensure you have this configured
import { logProcessingQueue } from '../../queue/logQueue.js';

const router = express.Router();
const upload = multer(); // No destination since we are uploading directly to Supabase

router.post('/', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    // Upload the file to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
        .from('log-files') // Replace with your bucket name
        .upload(`uploads/${file.originalname}`, file.buffer, {
            contentType: file.mimetype,
            upsert: true // Set to true if you want to overwrite existing files
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
