import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload.js';
import statsRouter from './routes/stats.js';
import queueRouter from './routes/queue.js';
import rateLimit from 'express-rate-limit';
import signupRouter from '../api/routes/signup.js';
import loginRouter from '../api/routes/login.js';
import { authenticate } from '../middleware/authMiddleware.js'; 


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up rate limiter: Allow only 3 requests per IP per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3, 
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Routes
app.use('/signup', signupRouter)
app.use('/login', loginRouter)
app.use('/upload', limiter, authenticate, uploadRouter);
app.use('/stats', authenticate, statsRouter);
app.use('/queue-status', queueRouter);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
