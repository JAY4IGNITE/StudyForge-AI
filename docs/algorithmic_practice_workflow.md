# Algorithmic Problem Solving & Testing Workflow Standard

> **Target Platform**: StudyForge AI Platform & Technical Interview Preparation  
> **Language Focus**: Python 3.11+ (Backend) & TypeScript 5+ (Frontend)  
> **Test Framework**: Pytest / Vitest

---

## 1. The 4-Step Algorithmic Solution Framework

To consistently produce code that compiles, runs, and passes 100% of test cases without runtime errors or edge-case failures, follow this structured 4-step framework:

```text
+-----------------------------------------------------------------------------------+
| STEP 1: Understand & Clarify Requirements                                         |
| - Identify input/output types, invariants, and numeric constraints.                |
| - List explicit edge cases (empty input, duplicates, zero, max limits).           |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| STEP 2: Design Data Structures & Algorithmic Strategy                              |
| - Evaluate candidate approaches (Hash Map vs Sorting vs Two Pointers).            |
| - Verify Target Time & Space Complexity (e.g., O(N log N) time, O(N) space).    |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| STEP 3: Implement Clean, Modular Code                                             |
| - Type hints / Interfaces on all function parameters.                              |
| - Early return guards for boundary conditions.                                   |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| STEP 4: Comprehensive & Deterministic Unit Testing                                |
| - Base cases, representative inputs, extreme boundaries, and performance benchmarks.|
+-----------------------------------------------------------------------------------+
```

---

## 2. Example Problem & Complete Runnable Solution

### Problem: Merge Overlapping Intervals (LeetCode 56 - Medium)

#### Problem Statement
Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

#### Constraints
* $1 \le \text{intervals.length} \le 10^4$
* $\text{intervals}[i].\text{length} == 2$
* $0 \le \text{start}_i \le \text{end}_i \le 10^4$
* **Target Time Complexity**: $O(N \log N)$ due to sorting.
* **Target Auxiliary Space Complexity**: $O(N)$ for output storage.

---

### Python Solution: `backend/app/utils/interval_merger.py`

```python
from typing import List

class IntervalMerger:
    """
    Merges overlapping numerical intervals.
    Time Complexity: O(N log N) where N is the number of intervals.
    Space Complexity: O(N) auxiliary space to store the merged result.
    """

    @staticmethod
    def merge(intervals: List[List[int]]) -> List[List[int]]:
        # Guard clause for empty or single interval input
        if not intervals:
            return []
        if len(intervals) <= 1:
            return [list(interval) for interval in intervals]

        # Step 1: Sort intervals by starting boundary O(N log N)
        sorted_intervals = sorted(intervals, key=lambda x: x[0])

        merged: List[List[int]] = []

        for current in sorted_intervals:
            # If merged is empty or current interval does not overlap with previous
            if not merged or current[0] > merged[-1][1]:
                merged.append([current[0], current[1]])
            else:
                # Overlap detected: expand end boundary of the last interval
                merged[-1][1] = max(merged[-1][1], current[1])

        return merged
```

---

### Complete Unit Test Suite: `backend/tests/test_interval_merger.py`

```python
import pytest
import time
from app.utils.interval_merger import IntervalMerger

class TestIntervalMerger:
    """Comprehensive, deterministic unit tests for IntervalMerger."""

    def test_standard_overlapping_intervals(self):
        """Test case 1: Standard overlapping intervals."""
        intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
        expected = [[1, 6], [8, 10], [15, 18]]
        assert IntervalMerger.merge(intervals) == expected

    def test_contiguous_touching_boundaries(self):
        """Test case 2: Intervals touching at exact boundaries [1,4] and [4,5]."""
        intervals = [[1, 4], [4, 5]]
        expected = [[1, 5]]
        assert IntervalMerger.merge(intervals) == expected

    def test_fully_contained_nested_intervals(self):
        """Test case 3: One large interval completely encapsulating smaller ones."""
        intervals = [[1, 10], [2, 3], [4, 8]]
        expected = [[1, 10]]
        assert IntervalMerger.merge(intervals) == expected

    def test_unsorted_input_order(self):
        """Test case 4: Input provided out of order."""
        intervals = [[8, 10], [1, 3], [2, 6], [15, 18]]
        expected = [[1, 6], [8, 10], [15, 18]]
        assert IntervalMerger.merge(intervals) == expected

    def test_single_element_and_empty_list(self):
        """Test case 5: Boundary conditions (empty list & single interval)."""
        assert IntervalMerger.merge([]) == []
        assert IntervalMerger.merge([[1, 5]]) == [[1, 5]]

    def test_identical_duplicate_intervals(self):
        """Test case 6: Duplicate identical intervals."""
        intervals = [[2, 4], [2, 4], [2, 4]]
        expected = [[2, 4]]
        assert IntervalMerger.merge(intervals) == expected

    def test_performance_benchmark(self):
        """Performance validation test for 10,000 intervals (< 50ms)."""
        import random
        # Deterministic seed ensures zero test flakiness
        random.seed(42)
        large_input = [[i, i + random.randint(1, 5)] for i in range(0, 20000, 2)]

        start_time = time.perf_counter()
        result = IntervalMerger.merge(large_input)
        elapsed_ms = (time.perf_counter() - start_time) * 1000

        assert len(result) > 0
        assert elapsed_ms < 50.0, f"Execution took too long: {elapsed_ms:.2f}ms"
```

---

## 3. How to Run & Verify Tests Locally

### Run via Pytest
```bash
# Execute unit test suite with verbose output
backend/venv/Scripts/python.exe -m pytest backend/tests/test_interval_merger.py -v
```

---

## 4. Best Practices for Deterministic Testing

1. **Avoid Flaky Tests**:
   - Always seed pseudo-random number generators (`random.seed(42)`).
   - Use strict value assertions (`==`) rather than non-deterministic system clock dependencies.
   - Isolate test state so tests can run in parallel without shared memory mutations.

2. **Floating-Point Equality**:
   - Never use `==` for float metrics. Use `pytest.approx(expected, rel=1e-3)` or `Math.abs(actual - expected) < 1e-5`.

3. **Performance & Complexity Guards**:
   - Benchmarking tests should use high-resolution timers (`time.perf_counter()`) and set realistic execution bounds (e.g. $<50\text{ ms}$).
