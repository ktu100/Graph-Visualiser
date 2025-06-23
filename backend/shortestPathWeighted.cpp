#include <iostream>
#include <vector>
#include <climits>
#include <algorithm>
using namespace std;

struct Edge {
    int u, v;
    long long w;
};

int main() {
    int n, m, source, target;
    cin  >> n >> m >> source >> target;

    vector<Edge> edges;

    for (int i = 0; i < m; ++i) {
        int u, v;
        long long w;
        cin >> u >> v >> w;
        edges.push_back({u, v, w});
    }

    vector<long long> dist(n + 1, LLONG_MAX);
    vector<int> parent(n + 1, -1);
    dist[source] = 0;

    for (int i = 1; i <= n - 1; ++i) {
        for (const auto& e : edges) {
            if (dist[e.u] != LLONG_MAX && dist[e.u] + e.w < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.w;
                parent[e.v] = e.u;
            }
        }
    }

    for (const auto& e : edges) {
        if (dist[e.u] != LLONG_MAX && dist[e.u] + e.w < dist[e.v]) {
            cout << "NEGATIVE CYCLE" << endl;
            cout.flush();
            return 0;
        }
    }

    if (dist[target] == LLONG_MAX) {
        cout << "No Possible Path" << endl;
        cout.flush();
        return 0;
    }

    vector<int> path;
    for (int v = target; v != -1; v = parent[v])
        path.push_back(v);
    reverse(path.begin(), path.end());

    for (int v : path)
        cout << v << " ";
    cout << endl;
    cout.flush();

    return 0;
}
