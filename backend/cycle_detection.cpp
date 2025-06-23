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

int main() {
    int n, m;
    cin >> n >> m;

    vector<vector<int>> adj(n + 1); // 1-based
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
    }

    vector<int> visited(n + 1, 0), recStack(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        if (!visited[i] && dfs(i, adj, visited, recStack)) {
            cout << "YES\n"; // Cycle exists
            return 0;
        }
    }
    cout << "NO\n"; // No cycle
    return 0;
}
