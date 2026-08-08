export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isSample: boolean;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  description: string;
  inputSpecification: string;
  outputSpecification: string;
  constraints: string[];
  codeTemplates: {
    javascript: string;
    typescript: string;
    python: string;
  };
  sampleCases: TestCase[];
  hiddenCases: TestCase[];
  timeLimitMs: number;
  memoryLimitMb: number;
}

export interface TestRunResult {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  runtimeMs: number;
  error?: string;
}

export interface ProblemSubmission {
  problemId: string;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error';
  passedCount: number;
  totalCount: number;
  submittedAt: string;
}
