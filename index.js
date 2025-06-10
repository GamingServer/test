const process = require("process");

// CPU Usage
const startUsage = process.cpuUsage();


// RAM Usage
// setInterval(() => {
//   const memory = process.memoryUsage();
//   console.clear();
//   const usage = process.cpuUsage(startUsage);
//   const user = usage.user / 1000000; // Convert microseconds to seconds
//   const system = usage.system / 1000000;
//   console.log(
//     `CPU Usage: User ${user.toFixed(2)}s, System ${system.toFixed(2)}s`
//   );
//   console.log("RAM Usage:");
//   console.log(`  RSS: ${(memory.rss / 1024 / 1024).toFixed(2)} MB`);
//   console.log(
//     `  Heap Total: ${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`
//   );
//   console.log(`  Heap Used: ${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
//   console.log(`  External: ${(memory.external / 1024 / 1024).toFixed(2)} MB`);
// }, 1000);

const os = require('os');

const Limit = require('express-rate-limit')

const limit =  Limit({
    windowMs: 1000*60, 
    max: 2500, 
    message:"to many requests"
})

// System information
console.log('Platform:', os.platform()); // e.g., 'linux', 'win32', 'darwin'
console.log('Architecture:', os.arch()); // e.g., 'x64', 'arm'
console.log('OS Type:', os.type()); // e.g., 'Linux', 'Windows_NT'
console.log('OS Release:', os.release()); // OS version
console.log('Hostname:', os.hostname()); // System hostname
console.log('Uptime:', os.uptime(), 'seconds'); // System uptime
console.log('Total Memory:', os.totalmem(), 'bytes'); // Total system memory
console.log('Free Memory:', os.freemem(), 'bytes'); // Free memory
console.log('CPUs:', os.cpus()); // CPU info (array of core details)
console.log('Network Interfaces:', os.networkInterfaces()); // Network interfaces
console.log('Home Directory:', os.homedir()); // User home directory
console.log('Temp Directory:', os.tmpdir()); // Temporary directory
console.log('Endianness:', os.endianness()); // Byte order: 'BE' or 'LE'
console.log('Load Average:', os.loadavg()); // System load averages (1, 5, 15 minutes)

const express = require("express");
const app = express();
const port = 8081;
app.use(limit)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});