import { executeSync } from './executorLogic';
import type { TestCase } from '../types';

// Runs entirely in a dedicated Worker thread. If the user's code has an
// infinite loop, this worker (not the app's main thread) is what hangs --
// the main thread stays responsive and ExecutorSandbox.runTest() terminates
// this worker after its timeout.
self.onmessage = (e: MessageEvent<{ code: string; testCase: TestCase; language: string }>) => {
  const { code, testCase, language } = e.data;
  const result = executeSync(code, testCase, language);
  (self as unknown as Worker).postMessage(result);
};
