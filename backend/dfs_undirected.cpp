#include <iostream>
#include <vector>
using namespace std;

void dfs(int node, vector<vector<int>>& adj, vector<int>& visited,vector<int>&v) {
    visited[node] = 1;
    v.push_back(node);
    for (int neighbor : adj[node]) {
        if (!visited[neighbor])dfs(neighbor,adj,visited,v);
    }
}

int main() {
    int n,m,start;
    cin >> n>>m>>start;

    vector<vector<int>> adj(n + 1); // 1-based
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    

    vector<int> visited(n + 1, 0);
    vector<int>v;
    dfs(start,adj,visited,v);
    cout<<"DFS: ";
    for(auto it:v){
        cout<<it<<" ";
    }
    return 0;
}
