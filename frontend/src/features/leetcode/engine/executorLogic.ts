import { TestCase, TestRunResult } from '../types';

/**
 * Pure, side-effect-free execution logic. Kept separate from ExecutorSandbox
 * so it can be imported both by the main thread (for reference/testing) and
 * by executor.worker.ts, which actually runs it off the main thread.
 */

export function extractFunctionName(code: string): string | null {
  const fnDecl = code.match(/^\s*function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/m);
  if (fnDecl) return fnDecl[1];

  const varDecl = code.match(/^\s*(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/m);
  if (varDecl) return varDecl[1];

  return null;
}

export function stripTypes(code: string): string {
  return code
    .replace(/:\s*(?:number|string|boolean|any|void|never|unknown)(?:\[\])*(?:\s*\|[^,)={}]+)*/g, '')
    .replace(/<(?:number|string|boolean|any|void|never|unknown|[A-Z]\w*)(?:\[\])?(?:\s*,\s*(?:number|string|boolean|any|void|never|unknown|[A-Z]\w*)(?:\[\])?)*>/g, '')
    .replace(/\s+as\s+\w+(?:\[\])*/g, '')
    .replace(/^\s*(?:interface|type)\s+.*$/gm, '')
    .replace(/^\s*export\s+/gm, '');
}

export function compareOutput(actual: string, expected: string): boolean {
  const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();
  if (normalize(actual) === normalize(expected)) return true;

  try {
    const a = JSON.parse(actual);
    const e = JSON.parse(expected);
    return JSON.stringify(a) === JSON.stringify(e);
  } catch {
    return false;
  }
}

/**
 * Runs user code against a single test case synchronously. Only safe to call
 * from a Worker context, since untrusted code (including infinite loops) can
 * block the thread it runs on indefinitely.
 */
export function executeSync(
  code: string,
  testCase: TestCase,
  language: string,
): Omit<TestRunResult, 'runtimeMs'> {
  if (language !== 'javascript' && language !== 'typescript') {
    return {
      testCaseId: testCase.id,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: 'Python in-browser evaluation requires Pyodide. Switch to JavaScript for instant browser execution.',
      passed: false,
    };
  }

  try {
    const cleanCode = language === 'typescript' ? stripTypes(code) : code;
    const fnName = extractFunctionName(cleanCode);
    if (!fnName) {
      throw new Error(
        'No function found. Define your solution as a named function (e.g., function twoSum(...) { }).',
      );
    }

    const userFn = new Function(`
      ${cleanCode}
      if (typeof ${fnName} === 'function') return ${fnName};
      throw new Error('Function "${fnName}" is not callable.');
    `)();

    const args = JSON.parse(`[${testCase.input}]`);
    const actualOutput = userFn(...args);

    const actualStr = JSON.stringify(actualOutput);
    const expectedStr = testCase.expectedOutput.trim();
    const passed = compareOutput(actualStr, expectedStr);

    return {
      testCaseId: testCase.id,
      input: testCase.input,
      expectedOutput: expectedStr,
      actualOutput: actualStr,
      passed,
    };
  } catch (err: any) {
    return {
      testCaseId: testCase.id,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: 'Runtime Error',
      passed: false,
      error: err.message || 'Execution Error',
    };
  }
}
