---
layout: "../../layouts/BlogPost.astro"
title: "Leetcode | 1386. Cinema Seat Allocation"
date: "2026-08-21"
description: "Leetcode | 1386. Cinema Seat Allocation | Medium"
tags: ["DSA", "Leetcode","Bit manipulation"]
---

A cinema has `n` rows of seats, numbered from 1 to `n`. Each row has 10 seats, numbered from 1 to 10.

You are given a 2D integer array `reservedSeats`, where `reservedSeats[i] = [rowᵢ, seatᵢ]` means that seat `seatᵢ` in row `rowᵢ` is already reserved.

A four-person group must be assigned to four seats in the same row. The group can be seated in one of the following seat blocks:

- seats `2, 3, 4, 5`
- seats `4, 5, 6, 7`
- seats `6, 7, 8, 9`

A block can be used only if none of its seats are reserved. Each seat can be assigned to at most one group.

Return an integer denoting the maximum number of four-person groups that can be assigned.


## Solution

Before you begin, give it a try [on LeetCode](https://leetcode.com/problems/cinema-seat-allocation/).

The problem asks us to process each of the `n` rows independently — a group can only be seated within a single row, so the seating in row 1 has no bearing on row 2. That means the strategy is simple: figure out the maximum groups per row, then sum across all rows.

For a single row, there are only two cases to consider:

- **No seats reserved:** we can always fit exactly 2 groups — one in `[2,3,4,5]` and another in `[6,7,8,9]`, since these two blocks don't overlap.
- **Some seats reserved:** check the three valid blocks — `[2,3,4,5]`, `[4,5,6,7]`, `[6,7,8,9]` — from left to right. If a block has no reserved seat in it, seat a group there and mark those seats as taken (so the next block's check also accounts for them). This greedy left-to-right scan is enough because the three blocks overlap in a simple, linear way — there's no case where skipping an available block now unlocks a better outcome later.

> **Note:** the problem uses **1-based** seat numbering (seats 1–10), so keep that in mind when writing loop ranges and bit positions.

### Approach 1 — sets

The straightforward implementation represents each row's reserved seats as a Python `set`, and each valid block as a `set` too. A block is usable exactly when its intersection with the reserved seats is empty.

```python
# Note: this approach is correct but too slow for LeetCode's time limit (TLE)
from collections import defaultdict

class Solution:
    def maxNumberOfFamilies(self, n: int, reservedSeats: List[List[int]]) -> int:
        validPos = [
            set([2, 3, 4, 5]),
            set([4, 5, 6, 7]),
            set([6, 7, 8, 9]),
        ]

        def cost(taken):
            result = 0
            for pos in validPos:
                if not pos.intersection(taken):  # intersection is empty → block is free
                    taken = taken.union(pos)      # mark this block's seats as taken too
                    result += 1
            return result

        rows = defaultdict(set)
        for r, s in reservedSeats:
            rows[r].add(s)

        ans = 0
        for row in range(1, n + 1):
            if row in rows:
                ans += cost(rows[row])
            else:
                ans += 2
        return ans
```

This works, but building and intersecting `set` objects for every one of the `n` rows carries real overhead in Python, and it ends up too slow for the judge's time limit.

### Approach 2 — bitmasks

We can represent the same information far more cheaply using integers as bitmasks instead of sets. A seat being reserved just becomes "bit `s` is set" in an integer, and checking whether two seat sets overlap becomes a single `&` (AND) operation instead of building and comparing set objects — much closer to the CPU's native operations, and no per-element overhead.

To pull this off we need a few bitwise building blocks:

- **Setting the `s`-th bit:** `1 << s`
- **Union of two seat sets:** `a | b`
- **Intersection (checking overlap) of two seat sets:** `a & b` (this is `0` when there's no overlap)
- [`functools.reduce`](https://docs.python.org/3/library/functools.html#functools.reduce) to fold a list of seat numbers into a single bitmask, one bit at a time

We can also skip a step: instead of looping over every row from `1` to `n` and checking whether it has reservations, we start by assuming **every** row gets its full 2 groups (`n * 2`), and only revisit the handful of rows that actually appear in `reservedSeats`, subtracting the shortfall for each one.

The block `[2, 3, 4, 5]` becomes the bitmask with bits 2 through 5 set (`0b0111100`), and so on for the other two blocks. A row's reserved seats become a bitmask the same way. If `taken & pos == 0`, the block has no overlap with what's already reserved, so we seat a group there and fold it into `taken` with `|` — otherwise, exactly the same logic as the set-based version.

```python
from collections import defaultdict
from functools import reduce

class Solution:
    def maxNumberOfFamilies(self, n: int, reservedSeats: List[List[int]]) -> int:
        validPos = [
            reduce(lambda x, pos: x | (1 << pos), [2, 3, 4, 5], 0),
            reduce(lambda x, pos: x | (1 << pos), [4, 5, 6, 7], 0),
            reduce(lambda x, pos: x | (1 << pos), [6, 7, 8, 9], 0),
        ]

        def cost(taken):
            result = 0
            for pos in validPos:
                if taken & pos == 0:
                    taken = taken | pos
                    result += 1
            return result

        rows = defaultdict(int)
        for r, s in reservedSeats:
            rows[r] = rows[r] | (1 << s)

        ans = n * 2
        for row in rows.values():
            ans = ans - (2 - cost(row))  # subtract the shortfall vs. the assumed 2 groups
        return ans
```

### Complexity

Let `n` be the number of rows and `k` be the number of entries in `reservedSeats`.

- **Approach 1 (sets):** Time `O(n)` — every row is visited once, and `cost` does a constant amount of set work per row. Space `O(k)` for the `rows` dictionary. Correct, but the constant-factor overhead of Python `set` operations pushes this past the time limit.
- **Approach 2 (bitmasks):** Time `O(n + k)` — we no longer scan every row, only the (at most `k`) rows that actually have a reservation, with `O(1)` bitwise work per row. Space `O(k)` for the `rows` dictionary.