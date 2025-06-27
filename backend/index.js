import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// const { spawn } = require('child_process');

app.post('/api/detect-cycle', (req, res) => {
  const { nodes, edges, directed } = req.body;

  // Determine the highest numbered node (for safety)
  let maxNode = 0;
  edges.forEach(({ from, to }) => {
    maxNode = Math.max(maxNode, from, to);
  });

  // Format the input for the C++ executable
  const input = `${directed ? 1 : 0} ${maxNode} ${edges.length}\n` +
    edges.map(({ from, to }) => `${from} ${to}`).join('\n') + '\n';

  // Spawn the C++ executable
  const child = spawn('./detect_cycle.exe'); // Make sure it's built and in the same directory

  let output = '';
  let error = '';

  console.log("Sending to C++:\n" + input);

  // Write input to the child process
  child.stdin.write(input);
  child.stdin.end();

  // Capture stdout from C++
  child.stdout.on('data', (data) => {
    output += data.toString();
    console.log('C++ stdout:', data.toString());
  });

  // Capture stderr (errors)
  child.stderr.on('data', (data) => {
    error += data.toString();
    console.error('C++ stderr:', data.toString());
  });

  // On process close, send response
  child.on('close', (code) => {
    console.log("Final C++ Output:", output.trim());

    if (code !== 0 || error) {
      return res.status(500).json({ error: 'Execution failed', detail: error });
    }

    // Clean up and interpret C++ output
    const result = output.trim().toUpperCase();

    if (result === 'YES') {
      res.json({ hasCycle: true });
    } else {
      res.json({ hasCycle: false });
    }
  });
});


app.post('/api/dfs', (req, res) => {
  const {nodes, edges, startNode, directed } = req.body;
  let maxNode = 0;
edges.forEach(({ from, to }) => {
  maxNode = Math.max(maxNode, from, to);
});
  const input = `${maxNode} ${edges.length} ${startNode}\n` +
    edges.map(({ from, to }) => `${from} ${to}`).join('\n');
    
  

  const exePath = directed ? './dfs_directed.exe' : './dfs_undirected.exe';
  const child = spawn(exePath);

  let output = '', error = '';
  console.log("DFS Input:\n", input);

  child.stdin.write(input);
  child.stdin.end();

  child.stdout.on('data', (data) => output += data.toString());
  child.stderr.on('data', (data) => error += data.toString());

  child.on('close', (code) => {
    if (code !== 0 || error) return res.status(500).json({ error: 'DFS failed', details: error });
    res.json({ traversal: output.trim().split(/\s+/).map(Number) });
  });
});

app.post('/api/bfs', (req, res) => {
  const {nodes, edges, startNode, directed } = req.body;
  let maxNode = 0;
edges.forEach(({ from, to }) => {
  maxNode = Math.max(maxNode, from, to);
});
  const input = `${maxNode} ${edges.length} ${startNode}\n` +
    edges.map(({ from, to }) => `${from} ${to}`).join('\n');
  
  

  const exePath = directed ? './bfs_directed.exe' : './bfs_undirected.exe';
  const child = spawn(exePath);

  let output = '', error = '';
  child.stdin.write(input);
  child.stdin.end();

  child.stdout.on('data', (data) => output += data.toString());
  child.stderr.on('data', (data) => error += data.toString());

  child.on('close', (code) => {
    if (code !== 0 || error) return res.status(500).json({ error: 'BFS failed', details: error });
    res.json({ traversal: output.trim().split(/\s+/).map(Number) });
  });
});

app.post('/api/shortest-path', (req, res) => {
  const {node, edges, source, target, directed, weighted } = req.body;
  let maxNode = 0;
edges.forEach(({ from, to }) => {
  maxNode = Math.max(maxNode, from, to);
});
maxNode = Math.max(maxNode, target);
maxNode = Math.max(maxNode, source);

let mnwt=10000000;

  const input = `${maxNode} ${edges.length} ${source} ${target}\n` +
    edges.map(({ from, to, weight }) => `${from} ${to} ${weight || 1}`).join('\n');

    for(let i=0;i<edges.length;i++){
      if(edges[i].weight<0)res.json("Not Allowed to enter negative weights in undirected graphs");
    }

  // console.log("directed:"+directed);

  const exePath =directed?'./weighted_shortest.exe':'./undirected_shortest.exe';
  // console.log(exePath);
  const child = spawn(exePath);
  let output = '', error = '';

  console.log("Sending to C++ (Shortest Path):\n" + input);

  child.stdin.write(input);
  child.stdin.end();

  child.stdout.on('data', (data) => output += data.toString());
  child.stderr.on('data', (data) => error += data.toString());

  

  child.on('close', (code) => {
    if (code !== 0 || error) return res.status(500).json({ error: 'Shortest path failed', details: error });
    // const result = output.trim().split(/\s+/).map(Number);
    // res.json({ path: result });
    const trimmed = output.trim();
    res.json(trimmed);

// Try to parse as numbers
// const parts = trimmed.split(/\s+/);
// const allNumbers = parts.every(p => !isNaN(p));

// if (allNumbers) {
//   res.json({ path: parts.map(Number) });
// } else {
//   res.json({ message: trimmed });
// }

    console.log("Output:"+trimmed);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
