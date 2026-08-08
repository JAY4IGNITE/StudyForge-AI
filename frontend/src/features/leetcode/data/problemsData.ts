import { Problem } from '../types';

export const PROBLEMS_DATA: Problem[] = [
  {
    id: 'p1',
    title: '1. Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    inputSpecification: 'nums: number[], target: number',
    outputSpecification: 'number[] (indices of the two numbers)',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    codeTemplates: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your code here
  
}
`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Write your code here
  return [];
}
`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your code here
    pass
`
    },
    sampleCases: [
      {
        id: 'tc1',
        input: '[2, 7, 11, 15], 9',
        expectedOutput: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
        isSample: true
      },
      {
        id: 'tc2',
        input: '[3, 2, 4], 6',
        expectedOutput: '[1,2]',
        explanation: 'nums[1] + nums[2] == 6, we return [1, 2].',
        isSample: true
      }
    ],
    hiddenCases: [
      {
        id: 'tc3',
        input: '[3, 3], 6',
        expectedOutput: '[0,1]',
        isSample: false
      }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p2',
    title: '242. Valid Anagram',
    slug: 'valid-anagram',
    difficulty: 'Easy',
    tags: ['String', 'Hash Table', 'Sorting'],
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    inputSpecification: 's: string, t: string',
    outputSpecification: 'boolean',
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.'
    ],
    codeTemplates: {
      javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
function isAnagram(s, t) {
  // Write your code here
  
}
`,
      typescript: `function isAnagram(s: string, t: string): boolean {
  // Write your code here
  return false;
}
`,
      python: `def isAnagram(s: str, t: str) -> bool:
    # Write your code here
    pass
`
    },
    sampleCases: [
      {
        id: 'tc1',
        input: '"anagram", "nagaram"',
        expectedOutput: 'true',
        isSample: true
      },
      {
        id: 'tc2',
        input: '"rat", "car"',
        expectedOutput: 'false',
        isSample: true
      }
    ],
    hiddenCases: [
      {
        id: 'tc3',
        input: '"listen", "silent"',
        expectedOutput: 'true',
        isSample: false
      }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p3',
    title: '53. Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.`,
    inputSpecification: 'nums: number[]',
    outputSpecification: 'number (maximum subarray sum)',
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    codeTemplates: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // Write your code here
  
}
`,
      typescript: `function maxSubArray(nums: number[]): number {
  // Write your code here
  return 0;
}
`,
      python: `def maxSubArray(nums: list[int]) -> int:
    # Write your code here
    pass
`
    },
    sampleCases: [
      {
        id: 'tc1',
        input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        expectedOutput: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
        isSample: true
      },
      {
        id: 'tc2',
        input: '[1]',
        expectedOutput: '1',
        isSample: true
      }
    ],
    hiddenCases: [
      {
        id: 'tc3',
        input: '[5, 4, -1, 7, 8]',
        expectedOutput: '23',
        isSample: false
      }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p4',
    title: '344. Reverse String',
    slug: 'reverse-string',
    difficulty: 'Easy',
    tags: ['String', 'Two Pointers'],
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array **in-place** with O(1) extra memory.

Return the reversed array.`,
    inputSpecification: 's: string[]',
    outputSpecification: 'string[] (reversed)',
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is a printable ASCII character.'
    ],
    codeTemplates: {
      javascript: `/**
 * @param {string[]} s
 * @return {string[]}
 */
function reverseString(s) {
  // Write your code here

}
`,
      typescript: `function reverseString(s: string[]): string[] {
  // Write your code here
  return s;
}
`,
      python: `def reverseString(s: list[str]) -> list[str]:
    # Write your code here
    pass
`
    },
    sampleCases: [
      {
        id: 'tc1',
        input: '["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]',
        explanation: 'The reversed array is ["o","l","l","e","h"].',
        isSample: true
      },
      {
        id: 'tc2',
        input: '["H","a","n","n","a","h"]',
        expectedOutput: '["h","a","n","n","a","H"]',
        isSample: true
      }
    ],
    hiddenCases: [
      {
        id: 'tc3',
        input: '["A"]',
        expectedOutput: '["A"]',
        isSample: false
      }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p5',
    title: '217. Contains Duplicate',
    slug: 'contains-duplicate',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table', 'Sorting'],
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
    inputSpecification: 'nums: number[]',
    outputSpecification: 'boolean',
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9'
    ],
    codeTemplates: {
      javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function containsDuplicate(nums) {
  // Write your code here

}
`,
      typescript: `function containsDuplicate(nums: number[]): boolean {
  // Write your code here
  return false;
}
`,
      python: `def containsDuplicate(nums: list[int]) -> bool:
    # Write your code here
    pass
`
    },
    sampleCases: [
      {
        id: 'tc1',
        input: '[1, 2, 3, 1]',
        expectedOutput: 'true',
        explanation: 'The element 1 appears at indices 0 and 3.',
        isSample: true
      },
      {
        id: 'tc2',
        input: '[1, 2, 3, 4]',
        expectedOutput: 'false',
        isSample: true
      }
    ],
    hiddenCases: [
      {
        id: 'tc3',
        input: '[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]',
        expectedOutput: 'true',
        isSample: false
      }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p6',
    title: '121. Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-sell-stock',
    difficulty: 'Easy',
    tags: ['Array', 'Dynamic Programming'],
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    inputSpecification: 'prices: number[]',
    outputSpecification: 'number (maximum profit)',
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    codeTemplates: {
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  // Write your code here

}
`,
      typescript: `function maxProfit(prices: number[]): number {
  // Write your code here
  return 0;
}
`,
      python: `def maxProfit(prices: list[int]) -> int:
    # Write your code here
    pass
`
    },
    sampleCases: [
      {
        id: 'tc1',
        input: '[7, 1, 5, 3, 6, 4]',
        expectedOutput: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.',
        isSample: true
      },
      {
        id: 'tc2',
        input: '[7, 6, 4, 3, 1]',
        expectedOutput: '0',
        explanation: 'No transaction yields a positive profit.',
        isSample: true
      }
    ],
    hiddenCases: [
      {
        id: 'tc3',
        input: '[2, 4, 1]',
        expectedOutput: '2',
        isSample: false
      }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p7',
    title: '125. Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    tags: ['String', 'Two Pointers'],
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    inputSpecification: 's: string',
    outputSpecification: 'boolean',
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    codeTemplates: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // Write your code here

}
`,
      typescript: `function isPalindrome(s: string): boolean {
  // Write your code here
  return false;
}
`,
      python: `def isPalindrome(s: str) -> bool:
    # Write your code here
    pass
`
    },
    sampleCases: [
      {
        id: 'tc1',
        input: '"A man, a plan, a canal: Panama"',
        expectedOutput: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.',
        isSample: true
      },
      {
        id: 'tc2',
        input: '"race a car"',
        expectedOutput: 'false',
        explanation: '"raceacar" is not a palindrome.',
        isSample: true
      }
    ],
    hiddenCases: [
      {
        id: 'tc3',
        input: '" "',
        expectedOutput: 'true',
        isSample: false
      }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p8',
    title: '49. Group Anagrams',
    slug: 'group-anagrams',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'String', 'Sorting'],
    description: `Given an array of strings \`strs\`, group the **anagrams** together. You can return the answer in any order.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.`,
    inputSpecification: 'strs: string[]',
    outputSpecification: 'string[][] (grouped anagrams)',
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.'
    ],
    codeTemplates: {
      javascript: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
  // Write your code here

}
`,
      typescript: `function groupAnagrams(strs: string[]): string[][] {
  // Write your code here
  return [];
}
`,
      python: `def groupAnagrams(strs: list[str]) -> list[list[str]]:
    # Write your code here
    pass
`
    },
    sampleCases: [
      {
        id: 'tc1',
        input: '["eat","tea","tan","ate","nat","bat"]',
        expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: 'The groups are: ["bat"], ["nat","tan"], ["ate","eat","tea"].',
        isSample: true
      },
      {
        id: 'tc2',
        input: '[""]',
        expectedOutput: '[[""]]',
        isSample: true
      }
    ],
    hiddenCases: [
      {
        id: 'tc3',
        input: '["a"]',
        expectedOutput: '[["a"]]',
        isSample: false
      }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p9',
    title: '238. Product of Array Except Self',
    slug: 'product-of-array-except-self',
    difficulty: 'Medium',
    tags: ['Array', 'Prefix Sum'],
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is guaranteed to fit in a **32-bit** integer.

You must write an algorithm that runs in **O(n)** time and without using the division operation.`,
    inputSpecification: 'nums: number[]',
    outputSpecification: 'number[]',
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
      'The product of any prefix or suffix fits in a 32-bit integer.'
    ],
    codeTemplates: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function productExceptSelf(nums) {
  // Write your code here

}
`,
      typescript: `function productExceptSelf(nums: number[]): number[] {
  // Write your code here
  return [];
}
`,
      python: `def productExceptSelf(nums: list[int]) -> list[int]:
    # Write your code here
    pass
`
    },
    sampleCases: [
      {
        id: 'tc1',
        input: '[1, 2, 3, 4]',
        expectedOutput: '[24,12,8,6]',
        explanation: 'answer[0] = 2*3*4 = 24, answer[1] = 1*3*4 = 12, etc.',
        isSample: true
      },
      {
        id: 'tc2',
        input: '[-1, 1, 0, -3, 3]',
        expectedOutput: '[0,0,9,0,0]',
        isSample: true
      }
    ],
    hiddenCases: [
      {
        id: 'tc3',
        input: '[2, 3]',
        expectedOutput: '[3,2]',
        isSample: false
      }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p10',
    title: '3. Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating',
    difficulty: 'Medium',
    tags: ['String', 'Sliding Window', 'Hash Table'],
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    inputSpecification: 's: string',
    outputSpecification: 'number (length of longest substring)',
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols, and spaces.'
    ],
    codeTemplates: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Write your code here

}
`,
      typescript: `function lengthOfLongestSubstring(s: string): number {
  // Write your code here
  return 0;
}
`,
      python: `def lengthOfLongestSubstring(s: str) -> int:
    # Write your code here
    pass
`
    },
    sampleCases: [
      {
        id: 'tc1',
        input: '"abcabcbb"',
        expectedOutput: '3',
        explanation: 'The longest substring without repeating characters is "abc", length 3.',
        isSample: true
      },
      {
        id: 'tc2',
        input: '"bbbbb"',
        expectedOutput: '1',
        isSample: true
      },
      {
        id: 'tc3',
        input: '"pwwkew"',
        expectedOutput: '3',
        explanation: 'The answer is "wke", length 3.',
        isSample: true
      }
    ],
    hiddenCases: [
      {
        id: 'tc4',
        input: '""',
        expectedOutput: '0',
        isSample: false
      }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p11',
    title: '23. Merge k Sorted Lists',
    slug: 'merge-k-sorted-lists',
    difficulty: 'Hard',
    tags: ['Linked List', 'Divide and Conquer', 'Heap'],
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

**Note**: For this in-browser exercise, linked lists are represented as sorted arrays. Merge the arrays into a single sorted array.`,
    inputSpecification: 'lists: number[][] (array of sorted arrays)',
    outputSpecification: 'number[] (single merged sorted array)',
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      '-10^4 <= lists[i][j] <= 10^4',
      'lists[i] is sorted in ascending order.'
    ],
    codeTemplates: {
      javascript: `/**
 * @param {number[][]} lists
 * @return {number[]}
 */
function mergeKLists(lists) {
  // Write your code here

}
`,
      typescript: `function mergeKLists(lists: number[][]): number[] {
  // Write your code here
  return [];
}
`,
      python: `def mergeKLists(lists: list[list[int]]) -> list[int]:
    # Write your code here
    pass
`
    },
    sampleCases: [
      {
        id: 'tc1',
        input: '[[1,4,5],[1,3,4],[2,6]]',
        expectedOutput: '[1,1,2,3,4,4,5,6]',
        explanation: 'Merging [1,4,5], [1,3,4], [2,6] yields [1,1,2,3,4,4,5,6].',
        isSample: true
      },
      {
        id: 'tc2',
        input: '[]',
        expectedOutput: '[]',
        isSample: true
      }
    ],
    hiddenCases: [
      {
        id: 'tc3',
        input: '[[]]',
        expectedOutput: '[]',
        isSample: false
      }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p12',
    title: '42. Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    tags: ['Array', 'Two Pointers', 'Stack', 'Dynamic Programming'],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    inputSpecification: 'height: number[]',
    outputSpecification: 'number (units of trapped water)',
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    codeTemplates: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  // Write your code here

}
`,
      typescript: `function trap(height: number[]): number {
  // Write your code here
  return 0;
}
`,
      python: `def trap(height: list[int]) -> int:
    # Write your code here
    pass
`
    },
    sampleCases: [
      {
        id: 'tc1',
        input: '[0,1,0,2,1,0,1,3,2,1,2,1]',
        expectedOutput: '6',
        explanation: 'The elevation map traps 6 units of rain water.',
        isSample: true
      },
      {
        id: 'tc2',
        input: '[4,2,0,3,2,5]',
        expectedOutput: '9',
        isSample: true
      }
    ],
    hiddenCases: [
      {
        id: 'tc3',
        input: '[4,2,3]',
        expectedOutput: '1',
        isSample: false
      }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p13',
    title: '15. 3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    inputSpecification: 'nums: number[]',
    outputSpecification: 'number[][] (triplets sum to 0)',
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5'
    ],
    codeTemplates: {
      javascript: `function threeSum(nums) {\n  // Write your code here\n  return [];\n}\n`,
      typescript: `function threeSum(nums: number[]): number[][] {\n  // Write your code here\n  return [];\n}\n`,
      python: `def threeSum(nums: list[int]) -> list[list[int]]:\n    # Write your code here\n    pass\n`
    },
    sampleCases: [
      { id: 'tc1', input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]', explanation: 'Triplets summing to 0 are [-1,0,1] and [-1,-1,2].', isSample: true },
      { id: 'tc2', input: '[0,1,1]', expectedOutput: '[]', isSample: true }
    ],
    hiddenCases: [
      { id: 'tc3', input: '[0,0,0]', expectedOutput: '[[0,0,0]]', isSample: false }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p14',
    title: '11. Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.`,
    inputSpecification: 'height: number[]',
    outputSpecification: 'number (max area)',
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    codeTemplates: {
      javascript: `function maxArea(height) {\n  // Write your code here\n  return 0;\n}\n`,
      typescript: `function maxArea(height: number[]): number {\n  // Write your code here\n  return 0;\n}\n`,
      python: `def maxArea(height: list[int]) -> int:\n    # Write your code here\n    pass\n`
    },
    sampleCases: [
      { id: 'tc1', input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49', explanation: 'Max area is between index 1 (height 8) and index 8 (height 7): min(8,7) * (8-1) = 49.', isSample: true },
      { id: 'tc2', input: '[1,1]', expectedOutput: '1', isSample: true }
    ],
    hiddenCases: [
      { id: 'tc3', input: '[4,3,2,1,4]', expectedOutput: '16', isSample: false }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p15',
    title: '56. Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'Medium',
    tags: ['Array', 'Sorting'],
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    inputSpecification: 'intervals: number[][]',
    outputSpecification: 'number[][] (merged non-overlapping intervals)',
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10^4'
    ],
    codeTemplates: {
      javascript: `function merge(intervals) {\n  // Write your code here\n  return [];\n}\n`,
      typescript: `function merge(intervals: number[][]): number[][] {\n  // Write your code here\n  return [];\n}\n`,
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:\n    # Write your code here\n    pass\n`
    },
    sampleCases: [
      { id: 'tc1', input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]', explanation: 'Intervals [1,3] and [2,6] overlap, merged into [1,6].', isSample: true },
      { id: 'tc2', input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]', isSample: true }
    ],
    hiddenCases: [
      { id: 'tc3', input: '[[1,4],[2,3]]', expectedOutput: '[[1,4]]', isSample: false }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p16',
    title: '200. Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix'],
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    inputSpecification: 'grid: string[][]',
    outputSpecification: 'number (island count)',
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is "0" or "1"'
    ],
    codeTemplates: {
      javascript: `function numIslands(grid) {\n  // Write your code here\n  return 0;\n}\n`,
      typescript: `function numIslands(grid: string[][]): number {\n  // Write your code here\n  return 0;\n}\n`,
      python: `def numIslands(grid: list[list[str]]) -> int:\n    # Write your code here\n    pass\n`
    },
    sampleCases: [
      { id: 'tc1', input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1', isSample: true },
      { id: 'tc2', input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3', isSample: true }
    ],
    hiddenCases: [
      { id: 'tc3', input: '[["1","0"],["0","1"]]', expectedOutput: '2', isSample: false }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p17',
    title: '146. LRU Cache',
    slug: 'lru-cache',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Linked List', 'Design', 'Doubly-Linked List'],
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\`, evict the least recently used key.

The functions \`get\` and \`put\` must each run in **O(1)** average time complexity.`,
    inputSpecification: 'capacity: number, operations: string[], args: number[][]',
    outputSpecification: '(number | null)[]',
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.'
    ],
    codeTemplates: {
      javascript: `class LRUCache {\n  constructor(capacity) {}\n  get(key) { return -1; }\n  put(key, value) {}\n}\n`,
      typescript: `class LRUCache {\n  constructor(capacity: number) {}\n  get(key: number): number { return -1; }\n  put(key: number, value: number): void {}\n}\n`,
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        return -1\n    def put(self, key: int, value: int) -> None:\n        pass\n`
    },
    sampleCases: [
      { id: 'tc1', input: 'capacity = 2, put(1,1), put(2,2), get(1), put(3,3), get(2)', expectedOutput: '[null, null, null, 1, null, -1]', explanation: 'get(2) returns -1 because key 2 was evicted when key 3 was inserted.', isSample: true }
    ],
    hiddenCases: [
      { id: 'tc2', input: 'capacity = 1, put(2,1), get(2)', expectedOutput: '[null, null, 1]', isSample: false }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p18',
    title: '76. Minimum Window Substring',
    slug: 'minimum-window-substring',
    difficulty: 'Hard',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    description: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the **minimum window substring** of \`s\` such that every character in \`t\` (including duplicates) is included in the window. If there is no such substring, return the empty string \`""\`.`,
    inputSpecification: 's: string, t: string',
    outputSpecification: 'string (minimum window)',
    constraints: [
      'm == s.length',
      'n == t.length',
      '1 <= m, n <= 10^5',
      's and t consist of uppercase and lowercase English letters.'
    ],
    codeTemplates: {
      javascript: `function minWindow(s, t) {\n  // Write your code here\n  return "";\n}\n`,
      typescript: `function minWindow(s: string, t: string): string {\n  // Write your code here\n  return "";\n}\n`,
      python: `def minWindow(s: str, t: str) -> str:\n    # Write your code here\n    pass\n`
    },
    sampleCases: [
      { id: 'tc1', input: '"ADOBECODEBANC", "ABC"', expectedOutput: '"BANC"', explanation: 'The minimum window substring "BANC" includes A, B, and C from string t.', isSample: true },
      { id: 'tc2', input: '"a", "a"', expectedOutput: '"a"', isSample: true }
    ],
    hiddenCases: [
      { id: 'tc3', input: '"a", "aa"', expectedOutput: '""', isSample: false }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p19',
    title: '70. Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    inputSpecification: 'n: number',
    outputSpecification: 'number (ways to reach top)',
    constraints: [
      '1 <= n <= 45'
    ],
    codeTemplates: {
      javascript: `function climbStairs(n) {\n  // Write your code here\n  return 0;\n}\n`,
      typescript: `function climbStairs(n: number): number {\n  // Write your code here\n  return 0;\n}\n`,
      python: `def climbStairs(n: int) -> int:\n    # Write your code here\n    pass\n`
    },
    sampleCases: [
      { id: 'tc1', input: '2', expectedOutput: '2', explanation: 'There are two ways to climb: (1 step + 1 step) or (2 steps).', isSample: true },
      { id: 'tc2', input: '3', expectedOutput: '3', explanation: 'Ways: (1+1+1), (1+2), (2+1).', isSample: true }
    ],
    hiddenCases: [
      { id: 'tc3', input: '5', expectedOutput: '8', isSample: false }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p20',
    title: '20. Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    tags: ['String', 'Stack'],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    inputSpecification: 's: string',
    outputSpecification: 'boolean',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\''
    ],
    codeTemplates: {
      javascript: `function isValid(s) {\n  // Write your code here\n  return false;\n}\n`,
      typescript: `function isValid(s: string): boolean {\n  // Write your code here\n  return false;\n}\n`,
      python: `def isValid(s: str) -> bool:\n    # Write your code here\n    pass\n`
    },
    sampleCases: [
      { id: 'tc1', input: '"()"', expectedOutput: 'true', isSample: true },
      { id: 'tc2', input: '"()[]{}"', expectedOutput: 'true', isSample: true },
      { id: 'tc3', input: '"(]"', expectedOutput: 'false', isSample: true }
    ],
    hiddenCases: [
      { id: 'tc4', input: '"{[]}"', expectedOutput: 'true', isSample: false }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p21',
    title: '206. Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

*(In array format representation: given an array \`head\`, return the array reversed).*`,
    inputSpecification: 'head: number[]',
    outputSpecification: 'number[] (reversed list)',
    constraints: [
      'The number of nodes in the list is in the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    codeTemplates: {
      javascript: `function reverseList(head) {\n  // Write your code here\n  return [];\n}\n`,
      typescript: `function reverseList(head: number[]): number[] {\n  // Write your code here\n  return [];\n}\n`,
      python: `def reverseList(head: list[int]) -> list[int]:\n    # Write your code here\n    pass\n`
    },
    sampleCases: [
      { id: 'tc1', input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', isSample: true },
      { id: 'tc2', input: '[1,2]', expectedOutput: '[2,1]', isSample: true }
    ],
    hiddenCases: [
      { id: 'tc3', input: '[]', expectedOutput: '[]', isSample: false }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p22',
    title: '33. Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    difficulty: 'Medium',
    tags: ['Array', 'Binary Search'],
    description: `There is an integer array \`nums\` sorted in ascending order (with distinct values).

Prior to being passed to your function, \`nums\` is **possibly rotated** at an unknown pivot index \`k\`.

Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with **O(log n)** runtime complexity.`,
    inputSpecification: 'nums: number[], target: number',
    outputSpecification: 'number (index of target or -1)',
    constraints: [
      '1 <= nums.length <= 5000',
      '-10^4 <= nums[i] <= 10^4',
      'All values of nums are unique.',
      '-10^4 <= target <= 10^4'
    ],
    codeTemplates: {
      javascript: `function search(nums, target) {\n  // Write your code here\n  return -1;\n}\n`,
      typescript: `function search(nums: number[], target: number): number {\n  // Write your code here\n  return -1;\n}\n`,
      python: `def search(nums: list[int], target: int) -> int:\n    # Write your code here\n    pass\n`
    },
    sampleCases: [
      { id: 'tc1', input: '[4,5,6,7,0,1,2], 0', expectedOutput: '4', isSample: true },
      { id: 'tc2', input: '[4,5,6,7,0,1,2], 3', expectedOutput: '-1', isSample: true }
    ],
    hiddenCases: [
      { id: 'tc3', input: '[1], 0', expectedOutput: '-1', isSample: false }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p23',
    title: '139. Word Break',
    slug: 'word-break',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Dynamic Programming', 'Trie'],
    description: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    inputSpecification: 's: string, wordDict: string[]',
    outputSpecification: 'boolean',
    constraints: [
      '1 <= s.length <= 300',
      '1 <= wordDict.length <= 1000',
      '1 <= wordDict[i].length <= 20',
      's and wordDict[i] consist of lowercase English letters.'
    ],
    codeTemplates: {
      javascript: `function wordBreak(s, wordDict) {\n  // Write your code here\n  return false;\n}\n`,
      typescript: `function wordBreak(s: string, wordDict: string[]): boolean {\n  // Write your code here\n  return false;\n}\n`,
      python: `def wordBreak(s: str, wordDict: list[str]) -> bool:\n    # Write your code here\n    pass\n`
    },
    sampleCases: [
      { id: 'tc1', input: '"leetcode", ["leet","code"]', expectedOutput: 'true', explanation: '"leetcode" can be segmented as "leet code".', isSample: true },
      { id: 'tc2', input: '"applepenapple", ["apple","pen"]', expectedOutput: 'true', isSample: true },
      { id: 'tc3', input: '"catsandog", ["cats","dog","sand","and","cat"]', expectedOutput: 'false', isSample: true }
    ],
    hiddenCases: [
      { id: 'tc4', input: '"cars", ["car","ca","rs"]', expectedOutput: 'true', isSample: false }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  },
  {
    id: 'p24',
    title: '295. Find Median from Data Stream',
    slug: 'find-median-from-data-stream',
    difficulty: 'Hard',
    tags: ['Two Pointers', 'Design', 'Heap', 'Data Stream'],
    description: `The **median** is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

Implement the \`MedianFinder\` class:
- \`MedianFinder()\` initializes the \`MedianFinder\` object.
- \`void addNum(int num)\` adds the integer \`num\` from the data stream to the data structure.
- \`double findMedian()\` returns the median of all elements so far.`,
    inputSpecification: 'nums: number[] (stream of elements to insert)',
    outputSpecification: 'number (final median)',
    constraints: [
      '-10^5 <= num <= 10^5',
      'There will be at least one element in the data structure before calling findMedian.',
      'At most 5 * 10^4 calls will be made to addNum and findMedian.'
    ],
    codeTemplates: {
      javascript: `class MedianFinder {\n  constructor() {}\n  addNum(num) {}\n  findMedian() { return 0.0; }\n}\n`,
      typescript: `class MedianFinder {\n  constructor() {}\n  addNum(num: number): void {}\n  findMedian(): number { return 0.0; }\n}\n`,
      python: `class MedianFinder:\n    def __init__(self):\n        pass\n    def addNum(self, num: int) -> None:\n        pass\n    def findMedian(self) -> float:\n        return 0.0\n`
    },
    sampleCases: [
      { id: 'tc1', input: '[1, 2, 3]', expectedOutput: '2.0', isSample: true },
      { id: 'tc2', input: '[1, 2]', expectedOutput: '1.5', isSample: true }
    ],
    hiddenCases: [
      { id: 'tc3', input: '[6, 10, 2, 6, 5]', expectedOutput: '6.0', isSample: false }
    ],
    timeLimitMs: 1000,
    memoryLimitMb: 128
  }
];

