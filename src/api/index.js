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
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import Redis from 'ioredis';

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
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/upload', limiter, authenticate, uploadRouter);
app.use('/stats', authenticate, statsRouter);
app.use('/queue-status', queueRouter);

// Create an HTTP server
const server = createServer(app);
const wss = new WebSocketServer({ server });
const activeSockets = [];


wss.on('connection', (ws) => {
  console.log('WebSocket client connected.');
  activeSockets.push(ws);

  ws.on('close', () => {
    console.log('WebSocket client disconnected.');
    activeSockets.splice(activeSockets.indexOf(ws), 1);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Create a Redis subscriber
const redisSubscriber = new Redis(process.env.REDIS_URL);

redisSubscriber.subscribe(process.env.REDIS_EVENT);

redisSubscriber.on('message', (channel, message) => {
  // Send the message to all connected WebSocket clients
  activeSockets.forEach(socket => {
    if (socket.readyState === socket.OPEN) {
      socket.send(message);
    }
  });
});


server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});