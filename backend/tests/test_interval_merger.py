import pytest
import time
import random
from app.utils.interval_merger import IntervalMerger

class TestIntervalMerger:
    """Comprehensive, deterministic unit tests for IntervalMerger."""

    def test_standard_overlapping_intervals(self):
        intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
        expected = [[1, 6], [8, 10], [15, 18]]
        assert IntervalMerger.merge(intervals) == expected

    def test_contiguous_touching_boundaries(self):
        intervals = [[1, 4], [4, 5]]
        expected = [[1, 5]]
        assert IntervalMerger.merge(intervals) == expected

    def test_fully_contained_nested_intervals(self):
        intervals = [[1, 10], [2, 3], [4, 8]]
        expected = [[1, 10]]
        assert IntervalMerger.merge(intervals) == expected

    def test_unsorted_input_order(self):
        intervals = [[8, 10], [1, 3], [2, 6], [15, 18]]
        expected = [[1, 6], [8, 10], [15, 18]]
        assert IntervalMerger.merge(intervals) == expected

    def test_single_element_and_empty_list(self):
        assert IntervalMerger.merge([]) == []
        assert IntervalMerger.merge([[1, 5]]) == [[1, 5]]

    def test_identical_duplicate_intervals(self):
        intervals = [[2, 4], [2, 4], [2, 4]]
        expected = [[2, 4]]
        assert IntervalMerger.merge(intervals) == expected

    def test_performance_benchmark(self):
        random.seed(42)  # Deterministic seed
        large_input = [[i, i + random.randint(1, 5)] for i in range(0, 20000, 2)]

        start_time = time.perf_counter()
        result = IntervalMerger.merge(large_input)
        elapsed_ms = (time.perf_counter() - start_time) * 1000

        assert len(result) > 0
        assert elapsed_ms < 50.0, f"Execution took too long: {elapsed_ms:.2f}ms"
