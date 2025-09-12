// services/course.ts (add below your existing exports)
export type TestQuestion = {
  question_id: number;
  question_text: string;
  question_type: "multiple_choice";
  options: string[];
  points: number;
};

export type TestAttempt = {
  attempt_id: number;
  score: number;
  percentage: number;
  passed: boolean;
  completed_at: string;
};

export type TestPayload = {
  test: {
    test_id: number;
    test_title: string;
    description: string;
    time_limit: number;      // minutes
    passing_score: number;   // percent
    questions: TestQuestion[];
    previous_attempt?: TestAttempt & { test_title: string; passing_score: number } | null;
  };
};

export type SubmitAnswer = { question_id: number; selected_answer: string };

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

export type ResultsResponse = {
  attempts: Array<TestAttempt & { test_title: string; passing_score: number }>;
  total_attempts: number;
};
