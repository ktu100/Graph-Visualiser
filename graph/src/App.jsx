import React, { useState } from 'react';
import GraphCanvas from './GraphCanvas';
import { PiGraphBold } from "react-icons/pi";
import './App.css'


//https://graph-visualiser-mbb.onrender.com
//https://graph-visualiser-frontend.onrender.com


const EdgeInputForm = () => {
  const [edges, setEdges] = useState([{ from: '', to: '', weight: '' }]);
  const [submittedEdges, setSubmittedEdges] = useState([]);
  const [isDirected, setIsDirected] = useState(true);
  const [isWeighted, setIsWeighted] = useState(true);
  const [startNode, setStartNode] = useState('');
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [shortestPathOutput, setShortestPathOutput] = useState('');
  const [dfsOutput, setDfsOutput] = useState('');
  const [bfsOutput, setBfsOutput] = useState('');
  const [cycleOutput, setCycleOutput] = useState('');

  const handleEdgeChange = (index, field, value) => {
    const updatedEdges = [...edges];
    updatedEdges[index][field] = value;
    setEdges(updatedEdges);
  };

  const addEdge = () => {
    setEdges([...edges, { from: '', to: '', weight: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedEdges(edges);
  };

  const getNodeCount = (edges) => {
    const nodes = new Set();
    edges.forEach(({ from, to }) => {
      nodes.add(from);
      nodes.add(to);
    });
    return nodes.size;
  };

 const checkCycle = async () => {
  try {
    const response = await fetch('https://graph-visualiser-mbb.onrender.com/api/detect-cycle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nodes: getNodeCount(submittedEdges),
        edges: submittedEdges.map(e => ({
          from: parseInt(e.from),
          to: parseInt(e.to)
        })),
        directed: isDirected
      })
    });

    const data = await response.json();

    console.log("Cycle API Response:", data); // ✅ Debug line
if (data?.hasCycle === true) {
      setCycleOutput('🚨 Cycle detected!');
    } else if (data?.hasCycle === false) {
      setCycleOutput('✅ No cycle detected.');
    } else {
      setCycleOutput('❓ Unexpected response from backend.');
    }
  } catch (error) {
    console.error("Error in cycle check:", error);
    setCycleOutput('❌ Error checking cycle');
  }
};


  const checkDFS = async () => {
    if (!startNode) {
      alert('Please enter a start node for DFS');
      return;
    }
    try {
      const response = await fetch('https://graph-visualiser-mbb.onrender.com/api/dfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes: getNodeCount(submittedEdges),
          edges: submittedEdges.map(e => ({
            from: parseInt(e.from),
            to: parseInt(e.to)
          })),
          startNode: parseInt(startNode),
          directed: isDirected
        })
      });

      const data = await response.json();
      setDfsOutput(data.traversal.join(' → '));
    } catch (error) {
      console.error(error);
      setDfsOutput('❌ DFS execution failed');
    }
  };

  const checkBFS = async () => {
    if (!startNode) {
      alert('Please enter a start node for BFS');
      return;
    }
    try {
      const response = await fetch('https://graph-visualiser-mbb.onrender.com/api/bfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes: getNodeCount(submittedEdges),
          edges: submittedEdges.map(e => ({
            from: parseInt(e.from),
            to: parseInt(e.to)
          })),
          startNode: parseInt(startNode),
          directed: isDirected
        })
      });

      const data = await response.json();
      setBfsOutput(data.traversal.join(' → '));
    } catch (error) {
      console.error(error);
      setBfsOutput('❌ BFS execution failed');
    }
  };

  const findShortestPath = async () => {
    if (!sourceNode || !targetNode) {
      alert("Please enter both source and target nodes.");
      return;
    }

    try {
      const response = await fetch('https://graph-visualiser-mbb.onrender.com/api/shortest-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes: getNodeCount(submittedEdges),
          edges: submittedEdges.map(e => ({
            from: parseInt(e.from),
            to: parseInt(e.to),
            weight: isWeighted ? parseInt(e.weight || 1) : 1
          })),
          source: parseInt(sourceNode),
          target: parseInt(targetNode),
          directed: isDirected,
          weighted: isWeighted
        })
      });

      const resultText = await response.text();
      setShortestPathOutput(resultText.trim());
    } catch (error) {
      console.error(error);
      setShortestPathOutput("❌ Error finding shortest path");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg overflow-x-auto">
      <form onSubmit={handleSubmit}>
       <div className="flex items-center mb-6 mx-10">
  <h2 className="text-2xl font-bold mt-5 font-serif text-amber-800">
    Graph Visualiser
  </h2>
  <PiGraphBold size={50} className="ml-3 text-amber-800" />
</div>
        <div className="flex gap-8 mb-4">
          <div>
            <label className="font-medium mr-2 text-blue-500 text-2xl">Graph Type:</label>
            <select
              value={isDirected ? 'directed' : 'undirected'}
              onChange={(e) => setIsDirected(e.target.value === 'directed')}
              className="p-2 border rounded"
            >
              <option value="directed">Directed</option>
              <option value="undirected">Undirected</option>
            </select>
          </div>
          <div>
            <label className="font-medium mr-2 text-blue-500 text-2xl">Edge Weights:</label>
            <select
              value={isWeighted ? 'weighted' : 'unweighted'}
              onChange={(e) => setIsWeighted(e.target.value === 'weighted')}
              className="p-2 border rounded"
            >
              <option value="weighted">Weighted</option>
              <option value="unweighted">Unweighted</option>
            </select>
          </div>
        </div>

        <h2 className="font-bold mb-2  text-green-500 text-2xl">Enter Edges</h2>
        {edges.map((edge, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="From"
              value={edge.from}
              onChange={(e) => handleEdgeChange(index, 'from', e.target.value)}
              className="p-2 border rounded w-1/3"
              required
            />
            <input
              type="text"
              placeholder="To"
              value={edge.to}
              onChange={(e) => handleEdgeChange(index, 'to', e.target.value)}
              className="p-2 border rounded w-1/3"
              required
            />
            {isWeighted && (
              <input
                type="number"
                placeholder="Weight"
                value={edge.weight}
                onChange={(e) => handleEdgeChange(index, 'weight', e.target.value)}
                className="p-2 border rounded w-1/3"
                required
              />
            )}
          </div>
        ))}

        <div className="flex gap-4 mt-4">
          <button type="button" onClick={addEdge} className="bg-blue-500 text-white px-4 py-2 rounded">
            + Add Edge
          </button>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Submit Graph
          </button>
        </div>
      </form>

      {submittedEdges.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-mono font-bold mb-2 overflow-auto flex justify-center">Graph Visualization</h2>
          <GraphCanvas edges={submittedEdges} isDirected={isDirected} isWeighted={isWeighted} 
           width={1000}
           height={800}
          className="w-1000 h-800 border rounded overflow-auto mx-400"/>

          <button onClick={checkCycle} className="bg-red-500 text-white px-4 py-2 rounded mb-2 mt-5">
              🔁 Check for Cycle
            </button>
          <div className="mt-6">
            <label className="font-medium mr-2">Start Node:</label>
            <input
              type="number"
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              className="p-2 border rounded"
              required
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button onClick={checkDFS} className="bg-purple-600 text-white px-4 py-2 rounded">
              🧭 Run DFS
            </button>
            <button onClick={checkBFS} className="bg-purple-600 text-white px-4 py-2 rounded">
              🧭 Run BFS
            </button>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <label className="font-medium">Source Node:</label>
            <input
              type="number"
              value={sourceNode}
              onChange={(e) => setSourceNode(e.target.value)}
              className="p-2 border rounded"
            />
            <label className="font-medium">Target Node:</label>
            <input
              type="number"
              value={targetNode}
              onChange={(e) => setTargetNode(e.target.value)}
              className="p-2 border rounded"
            />
            <button onClick={findShortestPath} className="bg-orange-500 text-white px-4 py-2 rounded">
              🎯 Find Shortest Path
            </button>
          </div>

          {shortestPathOutput && (
            <div className="mt-4 p-3 bg-white border rounded shadow">
              <strong>Shortest Path:</strong> {shortestPathOutput}
            </div>
          )}

          {dfsOutput && (
            <div className="mt-4 p-3 bg-white border rounded shadow">
              <strong>DFS Traversal:</strong> {dfsOutput}
            </div>
          )}

          {bfsOutput && (
            <div className="mt-4 p-3 bg-white border rounded shadow">
              <strong>BFS Traversal:</strong> {bfsOutput}
            </div>
          )}

          {cycleOutput && (
            <div className="mt-4 p-3 bg-white border rounded shadow">
              <strong>Cycle Check:</strong> {cycleOutput}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EdgeInputForm;
