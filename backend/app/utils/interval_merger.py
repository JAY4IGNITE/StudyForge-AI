from typing import List


class IntervalMerger:
    """
    Merges overlapping numerical intervals.
    Time Complexity: O(N log N) where N is the number of intervals.
    Space Complexity: O(N) auxiliary space to store the merged result.
    """

    @staticmethod
    def merge(intervals: List[List[int]]) -> List[List[int]]:
        if not intervals:
            return []
        if len(intervals) <= 1:
            return [list(interval) for interval in intervals]

        # Sort by start boundary
        sorted_intervals = sorted(intervals, key=lambda x: x[0])
        merged: List[List[int]] = []

        for current in sorted_intervals:
            if not merged or current[0] > merged[-1][1]:
                merged.append([current[0], current[1]])
            else:
                merged[-1][1] = max(merged[-1][1], current[1])

        return merged
