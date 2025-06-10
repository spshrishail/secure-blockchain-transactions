const { exec } = require('child_process');
const path = require('path');

console.log("Starting local Hardhat network...");

// Use the hardhat node command
const hardhatNode = exec('npx hardhat node', {
  cwd: path.resolve(__dirname, '..')
});

hardhatNode.stdout.on('data', (data) => {
  console.log(data.toString());
});

hardhatNode.stderr.on('data', (data) => {
  console.error(data.toString());
});

hardhatNode.on('close', (code) => {
  console.log(`Hardhat node process exited with code ${code}`);
});

// Keep the process running
process.stdin.resume();
console.log("\nPress Ctrl+C to stop the network"); 