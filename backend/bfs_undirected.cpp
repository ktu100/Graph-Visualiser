#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int main() {
    int n, m, start;
    cin >> n >> m >> start;

    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v); // undirected
        adj[v].push_back(u); // undirected
    }

    vector<int> dist(n + 1, 1e7);
    vector<int> visited(n + 1, 0);
    queue<int> q;

    q.push(start);
    visited[start] = 1;
    dist[start] = 0;

    while (!q.empty()) {
        int el = q.front();
        q.pop();
        for (auto it : adj[el]) {
            if (!visited[it]) {
                visited[it] = 1;
                dist[it] = dist[el] + 1;
                q.push(it);
            }
        }
    }

    cout << "BFS:" << endl;
    vector<pair<int, int>> bfs;
    for (int i = 1; i <= n; i++) {
        if (visited[i])
            bfs.push_back({dist[i], i});
    }

    sort(bfs.begin(), bfs.end()); // for ordered output

    for (auto it : bfs) {
        cout << it.second << " ";
    }
    cout << endl;

    return 0;
}
