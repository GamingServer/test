const process = require("process");

// CPU Usage
const startUsage = process.cpuUsage();


// RAM Usage
setInterval(() => {
  const memory = process.memoryUsage();
  console.clear();
  const usage = process.cpuUsage(startUsage);
  const user = usage.user / 1000000; // Convert microseconds to seconds
  const system = usage.system / 1000000;
  console.log(
    `CPU Usage: User ${user.toFixed(2)}s, System ${system.toFixed(2)}s`
  );
  console.log("RAM Usage:");
  console.log(`  RSS: ${(memory.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(
    `  Heap Total: ${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`
  );
  console.log(`  Heap Used: ${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  External: ${(memory.external / 1024 / 1024).toFixed(2)} MB`);
}, 1000);

const express = require("express");
const app = express();
const port = 8081;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});