import cluster from 'cluster';
import os from 'os';
import {worker}  from './worker.js'; 
import dotenv from 'dotenv';

dotenv.config();

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  // Fork workers but do not start workers in every fork
  worker; 
  console.log(`Primary process ${process.pid} is running`);
  
  // Fork workers for load balancing, if necessary for other purposes
  for (let i = 0; i < numCPUs-1; i++) {  // Start numCPUs-1 workers
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Each worker can handle other tasks, but not the worker logic
  console.log(`Worker process ${process.pid} started`);
}
