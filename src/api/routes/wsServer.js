import { createServer } from 'http';
import WebSocket from 'ws';
import { redisClient } from '../../services/redisClient.js';

const server = createServer();
const wss = new WebSocket.Server({ server });

const sub = new redisClient();
sub.subscribe('log-events');

wss.on('connection', (ws) => {
  console.log('WebSocket client connected.');

  // Forward Redis Pub/Sub messages to the client
  sub.on('message', (channel, message) => {
    if (channel === 'log-events') {
      ws.send(message); // Send job update to the connected WebSocket client
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected.');
  });
});

server.listen(3001, () => {
  console.log('WebSocket server running on ws://localhost:3001');
});
