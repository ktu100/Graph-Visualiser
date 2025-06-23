#include <iostream>
#include <vector>
#include <queue>
#include <climits>
#include <algorithm>
#include<bits/stdc++.h>
using namespace std;

struct Edge {
    int to;
    long long weight;
};

int main() {
    int n, m, source, target;
    cin >> n >> m >> source >> target;

    vector<vector<Edge>> graph(n + 1);
    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        graph[u].push_back({v, w});
        graph[v].push_back({u, w}); // if undirected
    }

    vector<long long> dist(n + 1, LLONG_MAX);
    vector<int> parent(n + 1, -1);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;

    dist[source] = 0;
    pq.push({0, source});

    while (!pq.empty()) {
        int d = pq.top().first;
        int u= pq.top().second;
        pq.pop();

        if (d > dist[u]) continue;

        for (const auto& e : graph[u]) {
            if (dist[u] + e.weight < dist[e.to]) {
                dist[e.to] = dist[u] + e.weight;
                parent[e.to] = u;
                pq.push({dist[e.to], e.to});
            }
        }
    }

    if (dist[target] == LLONG_MAX) {
        cout << "No Possible Path" << endl;
        return 0;
    }

    vector<int> path;
    for (int v = target; v != -1; v = parent[v])
        path.push_back(v);
    reverse(path.begin(), path.end());

    for (int v : path)
        cout << v << " ";
    cout << endl;

    return 0;
}
