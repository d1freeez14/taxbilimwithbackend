import {ResultsResponse, SubmitAnswer, SubmitResponse, TestPayload} from "@/types/test";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export const TestService = {
  // GET /api/tests/lesson/:lessonId
  getTestByLesson: async (lessonId: string, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/tests/lesson/${lessonId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Error fetching test");
    return data as TestPayload;
  },

  // POST /api/tests/lesson/:lessonId/submit
  submitTestAnswers: async (lessonId: string, token: string, answers: SubmitAnswer[]) => {
    const res = await fetch(`${BACKEND_URL}/api/tests/lesson/${lessonId}/submit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Error submitting answers");
    return data as SubmitResponse;
  },

  // GET /api/tests/results/:testId
  getTestResults: async (testId: string, token: string) => {
    const res = await fetch(`${BACKEND_URL}/api/tests/results/${testId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Error fetching results");
    return data as ResultsResponse;
  },
};