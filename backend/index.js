import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';


const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'https://graph-visualiser-frontend.onrender.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));



app.use(express.json());



app.post('/api/detect-cycle', (req, res) => {
  const { nodes, edges, directed } = req.body;


  let maxNode = 0;
  edges.forEach(({ from, to }) => {
    maxNode = Math.max(maxNode, from, to);
  });

  
  const input = `${directed ? 1 : 0} ${maxNode} ${edges.length}\n` +
    edges.map(({ from, to }) => `${from} ${to}`).join('\n') + '\n';

  
  const child = spawn('./detect_cycle'); 

  let output = '';
  let error = '';

  console.log("Sending to C++:\n" + input);

 
  child.stdin.write(input);
  child.stdin.end();

  
  child.stdout.on('data', (data) => {
    output += data.toString();
    console.log('C++ stdout:', data.toString());
  });

  
  child.stderr.on('data', (data) => {
    error += data.toString();
    console.error('C++ stderr:', data.toString());
  });

  
  child.on('close', (code) => {
    console.log("Final C++ Output:", output.trim());

    if (code !== 0 || error) {
      return res.status(500).json({ error: 'Execution failed', detail: error });
    }

   
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
    
  

  const exePath = directed ? './dfs_directed' : './dfs_undirected';
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
  
  

  const exePath = directed ? './bfs_directed' : './bfs_undirected';
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

  const exePath =directed?'./weighted_shortest':'./undirected_shortest';
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





    console.log("Output:"+trimmed);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
