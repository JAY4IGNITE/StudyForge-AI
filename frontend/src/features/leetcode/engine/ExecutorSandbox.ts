import { TestCase, TestRunResult } from '../types';

const EXECUTION_TIMEOUT_MS = 5000;

/**
 * ExecutorSandbox: In-browser JavaScript/TypeScript test runner.
 *
 * Execution happens in a dedicated Web Worker (see executor.worker.ts), not
 * on the main thread. Untrusted user code (e.g. an infinite `while(true){}`)
 * can therefore only hang the worker -- which we forcibly terminate after
 * EXECUTION_TIMEOUT_MS -- instead of freezing the whole app tab.
 */
export class ExecutorSandbox {
  static async runTest(
    code: string,
    testCase: TestCase,
    language: string = 'javascript',
  ): Promise<TestRunResult> {
    const startTime = performance.now();

    return new Promise<TestRunResult>((resolve) => {
      const worker = new Worker(new URL('./executor.worker.ts', import.meta.url), {
        type: 'module',
      });

      let settled = false;
      const finish = (result: Omit<TestRunResult, 'runtimeMs'>) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        worker.terminate();
        resolve({ ...result, runtimeMs: Math.round(performance.now() - startTime) });
      };

      const timer = setTimeout(() => {
        finish({
          testCaseId: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: 'Time Limit Exceeded',
          passed: false,
          error: `Execution exceeded ${EXECUTION_TIMEOUT_MS / 1000}s (possible infinite loop).`,
        });
      }, EXECUTION_TIMEOUT_MS);

      worker.onmessage = (e: MessageEvent<Omit<TestRunResult, 'runtimeMs'>>) => {
        finish(e.data);
      };

      worker.onerror = (e) => {
        finish({
          testCaseId: testCase.id,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: 'Runtime Error',
          passed: false,
          error: e.message || 'Worker execution error',
        });
      };

      worker.postMessage({ code, testCase, language });
    });
  }
}
