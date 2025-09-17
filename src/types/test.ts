// services/course.ts

// ---------- Server models (как приходит с бэка) ----------
export type TestQuestion = {
  id: number;
  question_text: string;
  question_type: "multiple_choice"; // расширишь при необходимости
  options: string[];
  points: number;
  correct_answer?: string; // ок как fallback
  question_order: number;
};

export type TestFromApi = {
  id: number;
  lesson_id: number | null;
  title: string;
  description: string | null;
  time_limit: number;     // minutes
  passing_score: number;  // percent
  created_at: string;
  updated_at: string;
  questions: TestQuestion[];
  // Если бэк когда-то вернёт прошлую попытку — поле опциональное:
  previous_attempt?: (TestAttempt & { test_title: string; passing_score: number }) | null;
};

export type TestPayload = {
  test: TestFromApi;
};

// ---------- Attempts / results ----------
export type TestAttempt = {
  attempt_id: number;
  score: number;
  percentage: number;
  passed: boolean;
  completed_at: string;
};

export type SubmitAnswer = { questionId: number; answer: string };

export type SubmitResponse = {
  message: string;
  attempt_id: number;
  score: number;
  total_possible: number;
  percentage: number;
  passed: boolean;
  answers: Array<{
    question_id: number;
    selected_answer: string;
    correct_answer: string;
    is_correct: boolean;
    points: number;
  }>;
};

export type AttemptSummary = {
  id: number;
  user_id: number;
  test_id: number;
  score: number;
  percentage: number | string;
  passed: boolean;
  completed_at: string;
  maxScore?: number;
};

export type AttemptsResponse = {
  attempts: AttemptSummary[];
};

export type ResultsResponse = {
  score: number;
  total_possible: number;
  percentage: number; // number
  passed: boolean;
  answers: Array<{
    question_id: number;
    selected_answer: string;
    correct_answer: string;
    is_correct: boolean;
    points: number;
  }>;
};