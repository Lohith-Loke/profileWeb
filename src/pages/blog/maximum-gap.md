---
layout: "../../layouts/BlogPost.astro"
title: "Leetcode | 164. Maximum Gap"
date: "2026-08-28"
description: "Leetcode | 164. Maximum Gap | Medium"
tags: ["DSA", "Leetcode","Sorting"]
---
Given an integer array `nums`, return the maximum difference between two successive elements in its sorted form. If the array contains less than two elements, return `0`.

You must write an algorithm that runs in `linear time` and uses `linear extra space`.

## Example 1

Input: nums = `[3,6,9,1]`
Output: `3`
Explanation: The sorted form of the array is `[1,3,6,9]`, and either `(3,6)` or `(6,9)` has the maximum difference `3`.

## Example 2

Input: nums = `[10]`
Output: `0`
Explanation: The array contains less than 2 elements, therefore return `0`.

## Solution

Before you begin, give it a try [on LeetCode](https://leetcode.com/problems/maximum-gap/).

The constraint that rules everything here is **linear time, linear extra space**. Comparison-based sorts are `O(n log n)`, so a normal "sort then scan for the biggest gap" approach is out. The only sorts that can run in linear time are non-comparison sorts like **Radix sort** or **Bucket sort** — we'll use bucketing, but instead of using it as a full sort, we only need it to narrow down *where* the maximum gap can possibly be.

### The key insight: pigeonhole principle

With `n` numbers, the sorted array has exactly `n - 1` consecutive gaps. If those gaps were spread out as evenly as possible across the full range, the *average* gap would be:

```
(max - min) / (n - 1)
```

Since this is an average, **at least one actual gap must be greater than or equal to it** — the true maximum gap can never be smaller than this average.

Now here's the trick: split the range `[min, max]` into buckets, each of size `bucket_size = ceil((max - min) / (n - 1))`. Since each bucket is *no larger* than that average gap, no single bucket can contain a gap bigger than `bucket_size` — which means **the maximum gap can never occur between two numbers inside the same bucket**. It can only occur *between* buckets: from the largest number in one non-empty bucket to the smallest number in the next non-empty bucket.

This is what makes the linear pass possible — we never need to look inside a bucket to find the maximum gap, only compare each bucket's minimum against the previous non-empty bucket's maximum.

### Putting it together

- **Bucket size:** `ceil((max - min) / (n - 1))`, per the reasoning above.
- **Number of buckets:** we need enough buckets to span the full range `max - min` at that size, which is `(max - min) // bucket_size + 1`.
- For each bucket, we only ever need to track its **minimum** and **maximum** element — everything in between is irrelevant, since the max gap can't hide inside a bucket.
- The answer is the largest difference between a bucket's minimum and the *previous* non-empty bucket's maximum.

```python
import math

class Solution:
    def maximumGap(self, nums: List[int]) -> int:
        n = len(nums)

        if n < 2:
            return 0

        mn = min(nums)
        mx = max(nums)

        if mn == mx:
            return 0

        bucket_size = math.ceil((mx - mn) / (n - 1))
        num_buckets = (mx - mn) // bucket_size + 1

        buckets = [
            [float("inf"), -float("inf")]
            for _ in range(num_buckets)
        ]

        # Put ALL numbers into buckets, including mn and mx
        for x in nums:
            idx = (x - mn) // bucket_size

            buckets[idx][0] = min(buckets[idx][0], x)
            buckets[idx][1] = max(buckets[idx][1], x)

        max_gap = 0
        prev_max = None

        for low, high in buckets:
            if low == float("inf"):
                continue

            if prev_max is not None:
                max_gap = max(max_gap, low - prev_max)

            prev_max = high

        return max_gap
```

### Complexity

- **Time:** `O(n)` — one pass to find `min`/`max`, one pass to place every element into its bucket, and one pass over the (at most `n`) buckets to find the maximum gap.
- **Space:** `O(n)` for the `buckets` array, which holds at most `n` buckets.