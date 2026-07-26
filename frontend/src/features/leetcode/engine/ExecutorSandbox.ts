import { TestCase, TestRunResult } from '../types';

export class ExecutorSandbox {
  static async runTest(code: string, testCase: TestCase, language: string = 'javascript'): Promise<TestRunResult> {
    const startTime = performance.now();
    try {
      let actualOutput: any;

      if (language === 'javascript' || language === 'typescript') {
        // Safe evaluation scope using Function constructor
        const userFn = new Function(`
          ${code}
          if (typeof twoSum === 'function') return twoSum;
          if (typeof isAnagram === 'function') return isAnagram;
          if (typeof maxSubArray === 'function') return maxSubArray;
          if (typeof solution === 'function') return solution;
          throw new Error('Solution function not found');
        `)();

        // Safely parse test inputs (e.g. "[2,7,11,15], 9")
        const args = JSON.parse(`[${testCase.input}]`);
        actualOutput = userFn(...args);
      } else {
        // Fallback for Python / simulated in-browser
        actualOutput = 'Python in-browser evaluation requires Pyodide. Switch to JavaScript for instant browser execution.';
      }

      const runtimeMs = Math.round(performance.now() - startTime);
      const actualStr = JSON.stringify(actualOutput);
      const expectedStr = testCase.expectedOutput.trim();
      const passed = actualStr.replace(/\s+/g, '') === expectedStr.replace(/\s+/g, '');

      return {
        testCaseId: testCase.id,
        input: testCase.input,
        expectedOutput: expectedStr,
        actualOutput: actualStr,
        passed,
        runtimeMs,
      };
    } catch (err: any) {
      return {
        testCaseId: testCase.id,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: 'Runtime Error',
        passed: false,
        runtimeMs: 0,
        error: err.message || 'Execution Error',
      };
    }
  }
}
