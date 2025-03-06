import cluster from 'cluster';
import os from 'os';
import {worker}  from './worker.js'; 

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  worker; 
  console.log(`Primary process ${process.pid} is running`);
  
  for (let i = 0; i < numCPUs-1; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  console.log(`Worker process ${process.pid} started`);
}
