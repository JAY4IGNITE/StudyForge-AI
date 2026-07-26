import { apiClient } from '../lib/axios';

export interface TopicItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  domain: string;
}

export const practiceService = {
  async getTopics(): Promise<TopicItem[]> {
    const res = await apiClient.get('/topics');
    return res.data;
  },

  async startSession(topicId: string) {
    const res = await apiClient.post('/practice/sessions', { topic_id: topicId });
    return res.data;
  },

  async fetchNextQuestion(sessionId: string) {
    const res = await apiClient.post(`/practice/sessions/${sessionId}/questions`);
    return res.data;
  },

  async submitAttempt(sessionId: string, questionId: string, answerText: string, durationSeconds: number = 45) {
    const res = await apiClient.post(`/practice/sessions/${sessionId}/attempts`, {
      question_id: questionId,
      answer_text: answerText,
      duration_seconds: durationSeconds,
    });
    return res.data;
  },

  async completeSession(sessionId: string) {
    const res = await apiClient.post(`/practice/sessions/${sessionId}/complete`);
    return res.data;
  },
};
