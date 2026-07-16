---
layout: "../../layouts/BlogPost.astro"
title: "Leetcode | 1291. Sequential Digits"
date: "2026-07-16"
description: "Leetcode | 1291. Sequential Digits | Medium"
tags: ["DSA", "Leetcode"]
---

An integer has sequential digits if and only if each digit in the number is one more than the previous digit.

Return a sorted list of all the integers in the range [`low`, `high`] inclusive that have sequential digits.

## Example 1

Input: low = `100`, high = `300`
Output: `[123, 234]`

## Example 2

Input: low = `1000`, high = `13000`
Output: `[1234, 2345, 3456, 4567, 5678, 6789, 12345]`

## Solution

Before reading the solution, give it a try [on LeetCode](https://leetcode.com/problems/sequential-digits/).

A number has sequential digits when each digit is exactly one greater than the digit before it — `123`, `2345`, and `6789` all qualify, but `132` or `1235` don't.

The key observation is that every possible sequential-digit number is just a **contiguous substring of `"123456789"`**. There's no digit sequence to "search" for — the digits `1` through `9` only ever appear in that one increasing order, so every valid number is already sitting inside that one string, waiting to be sliced out.

Since `"123456789"` has only 9 characters, the number of possible substrings is tiny: `9 + 8 + 7 + ... + 1 = 45`. So rather than reasoning about `low` and `high` at all, we can just generate all 45 substrings, convert each to an integer, and keep the ones that fall inside `[low, high]`.

```python
class Solution:
    def sequentialDigits(self, low: int, high: int) -> List[int]:
        digits = "123456789"
        n = len(digits)
        res = []

        for start in range(n):
            for end in range(start, n):
                num = int(digits[start:end + 1])
                if low <= num <= high:
                    res.append(num)

        # Substrings are generated in increasing start position first,
        # so short numbers starting with a large digit (e.g. "9") can
        # land in the list before longer numbers starting with a
        # smaller digit (e.g. "1234") — sort to fix the final order.
        res.sort()
        return res
```

### Complexity

- **Time:** `O(1)`. There are only `45` possible substrings of `"123456789"` regardless of the input range, and each one is at most 9 characters long, so the total work is bounded by a fixed constant.

  > Note: Generating all substring will takes **$O(n^2)$** [ actually its more like $\frac{n(n+1)}{2}$ ] time complexity, string `123456789` is constant hence will only take $\frac{9*10}{2} = 45$

- **Space:** `O(1)` beyond the output list, since we're not allocating anything that scales with `low` or `high`.
