const express = require('express');
const cluster = require('cluster');
const os = require('os');
const process = require('process');
const Limit = require('express-rate-limit');

// Rate limiter configuration
const limit = Limit({
  windowMs: 1000 * 60,
  max: 2500,
  message: "too many requests"
});

const numCPUs = os.cpus().length; // Number of CPU cores

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Log system information once in master
  console.log('Platform:', os.platform());
  console.log('Architecture:', os.arch());
  console.log('OS Type:', os.type());
  console.log('OS Release:', os.release());
  console.log('Hostname:', os.hostname());
  console.log('Uptime:', os.uptime(), 'seconds');
  console.log('Total Memory:', os.totalmem(), 'bytes');
  console.log('Free Memory:', os.freemem(), 'bytes');
  console.log('CPUs:', os.cpus());
  console.log('Network Interfaces:', os.networkInterfaces());
  console.log('Home Directory:', os.homedir());
  console.log('Temp Directory:', os.tmpdir());
  console.log('Endianness:', os.endianness());
  console.log('Load Average:', os.loadavg());

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker exit
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Replace dead worker
  });
} else {
  // Worker process
  const app = express();
  const port = 8081;

  // CPU Usage
  const startUsage = process.cpuUsage();

  // RAM and CPU Usage monitoring
//   setInterval(() => {
//     const memory = process.memoryUsage();
//     console.clear();
//     const usage = process.cpuUsage(startUsage);
//     const user = usage.user / 1000000; // Convert microseconds to seconds
//     const system = usage.system / 1000000;
//     console.log(`Worker ${process.pid} - CPU Usage: User ${user.toFixed(2)}s, System ${system.toFixed(2)}s`);
//     console.log(`Worker ${process.pid} - RAM Usage:`);
//     console.log(`  RSS: ${(memory.rss / 1024 / 1024).toFixed(2)} MB`);
//     console.log(`  Heap Total: ${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`);
//     console.log(`  Heap Used: ${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
//     console.log(`  External: ${(memory.external / 1024 / 1024).toFixed(2)} MB`);
//   }, 1000);

  // Apply rate limiter
  app.use(limit);

  // Sample route
  app.get('/', (req, res) => {
    res.send(`Hello World from worker ${process.pid}!`);
  });

  // Start server
  app.listen(port, () => {
    console.log(`Worker ${process.pid} listening on port ${port}`);
  });
}