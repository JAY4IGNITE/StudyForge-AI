import { TestCase, TestRunResult } from '../types';

/**
 * ExecutorSandbox: In-browser JavaScript/TypeScript test runner.
 *
 * Uses the Function constructor to create an isolated evaluation scope.
 * Dynamically detects the user's solution function by scanning for
 * `function <name>` declarations rather than hardcoding expected names.
 */
export class ExecutorSandbox {
  /**
   * Extracts the name of the first top-level function declaration from code.
   * Looks for patterns like `function twoSum(` or `const twoSum = (`
   */
  private static extractFunctionName(code: string): string | null {
    // Match: function <name>(
    const fnDecl = code.match(/^\s*function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/m);
    if (fnDecl) return fnDecl[1];

    // Match: const/let/var <name> = function or arrow
    const varDecl = code.match(/^\s*(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/m);
    if (varDecl) return varDecl[1];

    return null;
  }

  static async runTest(
    code: string,
    testCase: TestCase,
    language: string = 'javascript',
  ): Promise<TestRunResult> {
    const startTime = performance.now();
    try {
      let actualOutput: any;

      if (language === 'javascript' || language === 'typescript') {
        // Strip TypeScript type annotations for raw JS evaluation
        const cleanCode = language === 'typescript' ? ExecutorSandbox.stripTypes(code) : code;

        const fnName = ExecutorSandbox.extractFunctionName(cleanCode);
        if (!fnName) {
          throw new Error(
            'No function found. Define your solution as a named function (e.g., function twoSum(...) { }).',
          );
        }

        // Build an isolated scope that returns the user's function
        const userFn = new Function(`
          ${cleanCode}
          if (typeof ${fnName} === 'function') return ${fnName};
          throw new Error('Function "${fnName}" is not callable.');
        `)();

        // Parse test inputs (e.g. "[2,7,11,15], 9" → [array, number])
        const args = JSON.parse(`[${testCase.input}]`);
        actualOutput = userFn(...args);
      } else {
        actualOutput =
          'Python in-browser evaluation requires Pyodide. Switch to JavaScript for instant browser execution.';
      }

      const runtimeMs = Math.round(performance.now() - startTime);
      const actualStr = JSON.stringify(actualOutput);
      const expectedStr = testCase.expectedOutput.trim();
      const passed = ExecutorSandbox.compareOutput(actualStr, expectedStr);

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
        runtimeMs: Math.round(performance.now() - startTime),
        error: err.message || 'Execution Error',
      };
    }
  }

  /**
   * Flexible output comparison: normalizes whitespace and handles
   * JSON-equivalent representations (e.g. [0, 1] vs [0,1]).
   */
  private static compareOutput(actual: string, expected: string): boolean {
    const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();
    if (normalize(actual) === normalize(expected)) return true;

    // Try JSON deep equality for arrays/objects
    try {
      const a = JSON.parse(actual);
      const e = JSON.parse(expected);
      return JSON.stringify(a) === JSON.stringify(e);
    } catch {
      return false;
    }
  }

  /**
   * Minimal TypeScript → JavaScript transpilation for in-browser eval.
   * Strips type annotations, interfaces, and type keywords.
   */
  private static stripTypes(code: string): string {
    return code
      // Remove type annotations after colons (e.g., `: number[]`)
      .replace(/:\s*(?:number|string|boolean|any|void|never|unknown)(?:\[\])*(?:\s*\|[^,)={}]+)*/g, '')
      // Remove generic type params (e.g., `<T>`, `<string, number>`)
      .replace(/<(?:number|string|boolean|any|void|never|unknown|[A-Z]\w*)(?:\[\])?(?:\s*,\s*(?:number|string|boolean|any|void|never|unknown|[A-Z]\w*)(?:\[\])?)*>/g, '')
      // Remove `as` type assertions
      .replace(/\s+as\s+\w+(?:\[\])*/g, '')
      // Remove interface/type declarations (whole lines)
      .replace(/^\s*(?:interface|type)\s+.*$/gm, '')
      // Remove export keyword
      .replace(/^\s*export\s+/gm, '');
  }
}
