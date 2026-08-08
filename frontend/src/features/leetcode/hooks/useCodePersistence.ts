import { useState, useEffect } from 'react';
import { ProblemSubmission } from '../types';

const DRAFT_KEY_PREFIX = 'studyforge_leetcode_draft_';
const SUBMISSIONS_KEY = 'studyforge_leetcode_submissions';

export const useCodePersistence = (problemId: string, initialCode: string) => {
  const [code, setCode] = useState<string>(() => {
    const saved = localStorage.getItem(`${DRAFT_KEY_PREFIX}${problemId}`);
    return saved !== null ? saved : initialCode;
  });

  useEffect(() => {
    localStorage.setItem(`${DRAFT_KEY_PREFIX}${problemId}`, code);
  }, [problemId, code]);

  const saveSubmission = (submission: ProblemSubmission) => {
    const existing = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    existing.unshift(submission);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(existing));
  };

  const getSubmissions = (): ProblemSubmission[] => {
    const all = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    return all.filter((s: ProblemSubmission) => s.problemId === problemId);
  };

  return { code, setCode, saveSubmission, getSubmissions };
};
