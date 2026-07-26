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
  }
];
