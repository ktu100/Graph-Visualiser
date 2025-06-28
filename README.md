# 🧠 Graph Visualiser

A full-stack web application to **create, visualize**, and **run algorithms** on graphs, built using **React**, **Node.js**, and **C++**. It supports both **directed** and **undirected**,**weighted** and **unweighted** graphs, and provides features like **cycle detection**, **DFS**, **BFS**, and **shortest path** using custom-built C++ executables for performance.

## 🚀 Live Demo

- **Frontend**: [https://graph-visualiser-frontend.onrender.com](https://graph-visualiser-frontend.onrender.com)
- **Backend**: [https://graph-visualiser-fullbackend.onrender.com](https://graph-visualiser-fullbackend.onrender.com)

---

## 📸 Features

- 🔁 Visualize directed/undirected graphs dynamically
- 📦 Add weighted/unweighted edges
- 🚨 Cycle detection 
- 🧭 Run DFS & BFS from a selected start node
- 🎯 Compute shortest path from a start node to a target node
  
---

## 🛠️ Tech Stack

### Frontend
- React
- D3.js for graph drawing
- TailwindCSS
- Axios

### Backend
- Node.js + Express
- Spawn child processes to run `.exe` files
- CORS for frontend-backend communication

### Algorithms (C++)
- Cycle Detection
- DFS / BFS
- Dijkstra’s
- Bellman Ford

---



---

## 🧪 How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/ktu100/Graph-Visualiser.git
cd Graph-Visualiser
```

### 2. Start Backend
```bash
cd backend
npm install
# Compile all the .cpp files to form c++ executables , Eg. g++ dfs_directed.cpp -o dfs_directed.exe
node index.js
```

### 3. Start Frontend
```bash
cd graph
npm install
npm run dev
```


---

