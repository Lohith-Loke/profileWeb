---
layout: "../../layouts/BlogPost.astro"
title: "Leetcode | 3987. Minimum Total Cost to Process All Elements"
date: "2026-07-16"
description: "Leetcode | 3987. Minimum Total Cost to Process All Elements | Medium"
tags: ["DSA", "Leetcode"]
---

You are given an integer array `nums` and an integer `k`.

Initially, you have `k` units of resources. You must process the elements of `nums` from left to right. To process the `iᵗʰ` element, you need `nums[i]` resources.

If your available resources are less than `nums[i]`, you may perform an operation that increases your available resources by `k`. The value of `k` is fixed and does not change throughout the process. The first such operation incurs a cost of `1`, the second incurs a cost of `2`, and so on.

After processing the `iᵗʰ` element, your available resources decrease by `nums[i]`.

Return an integer denoting the minimum total cost required to process all elements. Since the answer may be very large, return it modulo `10**9 + 7`.

## Example 1:

Input: nums = `[1,1,7,14]`, k = `4`

Output: 15

Explanation:

- After processing `nums[0]`, we have `4 - 1 = 3` units of resources left.
- After processing `nums[1]`, we have `3 - 1 = 2` units of resources left.
- Since `nums[2] = 7` and only 2 units of resources are available, we perform two operations costing `1 + 2 = 3`. After processing `nums[2]`, we have `2 + 4 + 4 - 7 = 3` units of resources left.
- Since nums[3] = 14 and only 3 units of resources are available, we perform three operations costing `3 + 4 + 5 = 12`, to have `3` + `4` + `4` + `4` = `15` units of resources, which is enough to process `nums[3]`.
- Thus, the total cost is `3 + 12 = 15`.

## Solution

Before reading the solution, give it a try [on LeetCode](https://leetcode.com/problems/minimum-total-cost-to-process-all-elements/).

Let's break down what's actually happening, using `nums = [1, 1, 7, 14]`, `k = 4` as a running example.

- We start with `resource = k` — the first `k` units are free.
- To process `nums[i]`, we simply subtract it from `resource`.
- If `resource < nums[i]`, we're short, so we perform "top-up" operations: each one adds `k` to `resource`. But these top-ups aren't free — they cost `1`, then `2`, then `3`, and so on.
- The crucial detail is that this counter **never resets between elements**. If you already paid for 2 top-ups while processing an earlier element, the _next_ top-up — whichever element triggers it — costs `3`, not `1` again. So `cost` is a single running counter across the whole array, not a per-element one.

### Brute-force approach

The direct translation of that logic is to top up one `k` at a time in a `while` loop until we have enough:

```python
class Solution:
    def minimumCost(self, nums: list[int], k: int) -> int:
        res = 0
        resource = k
        cost = 0
        for ele in nums:
            while resource < ele:
                resource += k
                cost += 1
                res += cost
            resource -= ele
        return res % (10**9 + 7)
```

This works, but the inner `while` loop can run up to `ele / k` times per element, which is too slow when elements are large relative to `k`.

### Turning the loop into a formula

Say a given element needs the loop to run `x` times before `resource` is finally enough. We want the smallest `x` such that:

```
resource + k*x >= ele
```

Solving for `x`:

```
x >= (ele - resource) / k
```

Since `x` must be a whole number and we want the _smallest_ one that satisfies this, we round up:

```
x = ceil((ele - resource) / k) = (ele - resource + k - 1) // k
```

Now, instead of paying `1, 2, 3, ..., x` one at a time in a loop, notice these `x` operations are just the next `x` costs after wherever the global `cost` counter currently sits. So their total is:

```
= (cost + 1) + (cost + 2) + ... + (cost + x)
= cost * x + (1 + 2 + ... + x)
= cost * x + x*(x + 1) / 2
```

We add that directly to `res`, bump `resource` by `k * x` in one shot, and advance `cost` by `x` — all without looping.

```python
class Solution:
    def minimumCost(self, nums: list[int], k: int) -> int:
        res = 0
        resource = k
        cost = 0
        for ele in nums:
            if resource < ele:
                x = (ele - resource + k - 1) // k  # ceiling division
                res += cost * x + x * (x + 1) // 2
                resource += k * x
                cost += x
            resource -= ele
        return res % (10**9 + 7)
```

### Complexity

- **Time:** `O(n)` — a single pass over `nums`, with only constant-time arithmetic per element.
- **Space:** `O(1)` — no extra data structures, just a few running variables.
