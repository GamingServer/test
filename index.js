const express = require('express');
const cluster = require('cluster');
const os = require('os');
const process = require('process');
const Limit = require('express-rate-limit');

// Rate limiter configuration
const limit = Limit({
  windowMs: 1000 * 60,
  max: 2000,
  message: "too many requests"
});

const numCPUs = os.cpus().length; // Number of CPU cores

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Log system information once in master
  // console.log('Platform:', os.platform());
  // console.log('Architecture:', os.arch());
  // console.log('OS Type:', os.type());
  // console.log('OS Release:', os.release());
  // console.log('Hostname:', os.hostname());
  // console.log('Uptime:', os.uptime(), 'seconds');
  // console.log('Total Memory:', os.totalmem(), 'bytes');
  // console.log('Free Memory:', os.freemem(), 'bytes');
  // console.log('CPUs:', os.cpus());
  // console.log('Network Interfaces:', os.networkInterfaces());
  // console.log('Home Directory:', os.homedir());
  // console.log('Temp Directory:', os.tmpdir());
  // console.log('Endianness:', os.endianness());
  // console.log('Load Average:', os.loadavg());

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



  // Apply rate limiter
  app.use(limit);

  app.use((req, res, next) => {
  const start = Date.now();

  // Save original send function
  const originalSend = res.send;

  res.send = function (body) {
    const duration = Date.now() - start;

    console.log(`--- API CALL LOG ---`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`IP: ${req.ip}`);
    console.log(`Endpoint: ${req.method} ${req.originalUrl}`);
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Duration: ${duration}ms`);

    try {
      const parsed = JSON.parse(body);
      if (parsed?.approved !== undefined) {
        console.log(`Approved: ${parsed.approved}`);
      }
    } catch (e) {
      // body is not JSON or no approval info
    }

    console.log(`---------------------\n`);
    originalSend.apply(res, arguments);
  };

  next();
});

  // Sample route
  app.get('/', (req, res) => {
    res.send(`Hello World from worker ${process.pid}!`);
  });

  // Start server
  app.listen(port, () => {
    console.log(`Worker ${process.pid} listening on port ${port}`);
  });
}