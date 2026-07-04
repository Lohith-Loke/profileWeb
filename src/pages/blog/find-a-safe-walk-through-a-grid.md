---
layout: "../../layouts/BlogPost.astro"
title: "Leetcode | 3286. Find a Safe Walk Through a Grid"
date: "2026-07-04"
description: "Leetcode | 3286. Find a Safe Walk Through a Grid | Medium "
tags: ["DSA", "Leetcode"]
---

Before you read the solution, give it a try [here](https://leetcode.com/problems/find-a-safe-walk-through-a-grid/).

You are given an m x n binary matrix grid and an integer health.

You start on the upper-left corner (0, 0) and would like to get to the lower-right corner (m - 1, n - 1).

You can move up, down, left, or right from one cell to another adjacent cell as long as your health remains positive.

Cells (i, j) with grid[i][j] = 1 are considered unsafe and reduce your health by 1.

Return true if you can reach the final cell with a health value of 1 or more, and false otherwise.

Example 1:

Input: grid = [[0,1,0,0,0],[0,1,0,1,0],[0,0,0,1,0]], health = 1

Output: true

Explanation:

The final cell can be reached safely by walking along the gray cells below.

<table style="border-collapse:collapse;border-spacing:0;table-layout: fixed; width: 347px" class="tg"><colgroup><col style="width: 59px"><col style="width: 76px"><col style="width: 71px"><col style="width: 71px"><col style="width: 70px"></colgroup>
<thead>
<tr><th style="background-color:#34ff34;border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">0</th><th style="border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">1</th><th style="background-color:#34ff34;border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">0</th><th style="background-color:#34ff34;border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">0</th>
<th style="background-color:#34ff34;border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">0</th></tr>
</thead>
<tbody>
<tr><td style="background-color:#34ff34;border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">0</td><td style="border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">1</td><td style="background-color:#34ff34;border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">0</td><td style="border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">1</td>
<td style="background-color:#34ff34;border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">0</td></tr>
<tr><td style="background-color:#34ff34;border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">0</td><td style="background-color:#34ff34;border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">0</td><td style="background-color:#34ff34;border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">0</td><td style="border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">1</td>
<td style="background-color:#34ff34;border-color:inherit;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">0</td></tr>
</tbody></table>

# Solution

This problem is really about grid traversal: get from `(0, 0)` to `(n - 1, m - 1)` while losing as little health as possible along the way. Once you reach the destination, if your remaining health is less than `1`, return `false`; otherwise, return `true`.

Since we want the path with the minimum total cost (where "cost" is the number of unsafe cells crossed), this is a shortest-path problem. The natural choices are `BFS with 0-1 weights` or `Dijkstra's algorithm`. We'll use Dijkstra's algorithm here.

**Step 1 — Initialize distances.**
Create a `dist` grid that tracks the minimum cost to reach each cell, starting with all cells set to infinity:

```python
dist = [[float("inf")] * m for _ in range(n)]
```

**Step 2 — Explore with a min-heap.**
Starting from the source, repeatedly pop the lowest-cost cell from the heap and look at its neighbors. If a neighbor can be reached more cheaply through the current cell, update its distance and push it onto the heap.

**Step 3 — Skip stale entries.**
Because the same cell can be pushed onto the heap multiple times with different costs, we skip any popped entry whose cost is higher than the best known cost already recorded for that cell:

```python
if cost > dist[x][y]:
    continue
```

**Step 4 — Only push improvements.**
When relaxing an edge, only update and push a neighbor if the new path actually improves on its current best cost:

```python
if ncost < dist[nx][ny]:
    ...
```

Putting it all together:

```python
class Solution:
    def findSafeWalk(self, grid: List[List[int]], health: int) -> bool:
        n, m = len(grid), len(grid[0])
        que = [[grid[0][0], 0, 0]]
        directions = [(1, 0), (0, 1), (0, -1), (-1, 0)]
        dist = [[float("inf")] * m for _ in range(n)]

        while que:
            cost, x, y = heappop(que)

            if x == n - 1 and y == m - 1:
                return health - cost > 0

            if cost > dist[x][y]:
                continue

            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 <= nx < n and 0 <= ny < m:
                    ncost = cost + grid[nx][ny]
                    if ncost < dist[nx][ny]:
                        dist[nx][ny] = ncost
                        heappush(que, [ncost, nx, ny])

        return False
```

**Complexity.** With `n * m` cells and 4 directions per cell, this runs in `O(n * m * log(n * m))` time and `O(n * m)` space, which comfortably fits the constraints.

**Note:** Dijkstra's algorithm assumes non-negative edge weights. Since every move here costs either `0` or `1`, it's a safe fit — but if a variant of this problem ever introduced negative costs, you'd need a different algorithm (e.g., Bellman-Ford) instead.
