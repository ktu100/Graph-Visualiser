#include<bits/stdc++.h>
#include <iostream>
#include <vector>
using namespace std;

bool dfs(int node, vector<vector<int>>& adj, vector<int>& visited, vector<int>& recStack) {
    visited[node] = 1;
    recStack[node] = 1;

    for (int neighbor : adj[node]) {
        if (!visited[neighbor] && dfs(neighbor, adj, visited, recStack)) return true;
        else if (recStack[neighbor]) return true;
    }

    recStack[node] = 0;
    return false;
}

void f(int node,int parent, vector<vector<int>>& adj, vector<int>& visited,int &check){
    visited[node]=1;
    for(auto it:adj[node]){
        if(it!=parent){
            if(visited[it]){
                check=0;
                return;
            }
            else f(it,node,adj,visited,check);
        }
    }
}

int main() {
   int directed;

    int n, m;
    cin >> directed>>n >> m;
    // cout << "Read Input: " << directed << " " << n << " " << m << endl;

    vector<vector<int>> adj(n + 1); // 1-based
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        if(!directed)adj[v].push_back(u);
    }

    vector<int> visited(n + 1, 0), recStack(n + 1, 0);
    if(directed){
        for (int i = 1; i <= n; i++) {
        if (!visited[i] && dfs(i, adj, visited, recStack)) {
            cout << "YES\n"; // Cycle exists
            return 0;
        }
    }
    cout << "NO\n";
    }
    else{
        int check=1;
        f(1,0,adj,visited,check);
        if(check)cout<<"NO"<<endl;
        else cout<<"YES"<<endl;
    }
     // No cycle
    return 0;
}
