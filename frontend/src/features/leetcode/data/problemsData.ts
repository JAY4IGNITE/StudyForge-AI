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
  }
];
