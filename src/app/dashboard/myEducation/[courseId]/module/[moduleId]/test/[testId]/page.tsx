'use client'

import { useSession } from "@/lib/useSession";
import { TestService } from "@/services/test";
import {SubmitAnswer, SubmitResponse, TestPayload} from "@/types/test";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useMemo, useState} from "react";

const RU_LETTERS = ["A", "Б", "В", "Г", "Д", "Е"];

const TestPage = () => {
  const { getSession } = useSession();
  const session = getSession();
  const {testId} = useParams();
  const test_id = Array.isArray(testId) ? testId[0] : testId || "";
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery<TestPayload>({
    queryKey: ["test", test_id, session?.token],
    queryFn: () => TestService.getTestByLesson(test_id, session!.token!),
    enabled: Boolean(session?.token && test_id),
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // seconds
  const [result, setResult] = useState<SubmitResponse | null>(null);

  // start timer on load
  useEffect(() => {
    if (!data?.test?.time_limit) return;
    setTimeLeft(data.test.time_limit * 60);
  }, [data?.test?.time_limit]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit(); // auto-submit
      return;
    }
    const id = setInterval(() => setTimeLeft((s) => (s ? s - 1 : s)), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const test = data?.test;
  const questions = test?.questions ?? [];
  const q = questions[currentIdx];

  const { mutate: submit, isPending: submitting } = useMutation({
    mutationFn: (payload: SubmitAnswer[]) => TestService.submitTestAnswers(test_id, session!.token!, payload),
    onSuccess: (res) => setResult(res),
  });

  const handleSelect = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const progress = useMemo(() => {
    if (!questions.length) return "0/0";
    return `${currentIdx + 1}/${questions.length}`;
  }, [currentIdx, questions.length]);

  function handlePrev() {
    setCurrentIdx((i) => Math.max(0, i - 1));
  }

  function handleNext() {
    setCurrentIdx((i) => Math.min(questions.length - 1, i + 1));
  }

  function handleSkip() {
    handleNext();
  }

  function handleSubmit() {
    if (!questions.length || submitting) return;
    const payload: SubmitAnswer[] = questions.map((qq) => ({
      question_id: qq.question_id,
      selected_answer: answers[qq.question_id] ?? "", // empty if skipped
    }));
    submit(payload);
  }

  if (isLoading) {
    return <div className="w-full p-6">Loading…</div>;
  }
  if (isError) {
    return <div className="w-full p-6 text-red-600">Error: {(error as Error)?.message || "Failed to load test"}</div>;
  }
  if (!test) {
    return <div className="w-full p-6">No test found.</div>;
  }

  // After submit: show result review
  if (result) {
    return (
      <div className="w-full p-6">
        <div className={`mb-4 rounded-xl p-4 ${result.passed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-xl font-semibold">{result.passed ? "Test passed!" : "Test failed. Try again."}</h1>
            <div className="text-sm opacity-80">
              Score: <b>{result.score}</b> / {result.total_possible} • {result.percentage.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((qq, idx) => {
            const check = result.answers.find(a => a.question_id === qq.question_id);
            const selected = check?.selected_answer ?? answers[qq.question_id] ?? "";
            return (
              <div key={qq.question_id} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
                <div className="mb-3 text-slate-900 font-medium">
                  {idx + 1}. {qq.question_text}
                </div>
                <div className="space-y-3">
                  {qq.options.map((opt, i) => {
                    const isSelected = selected === opt;
                    const isCorrect = check?.correct_answer === opt;
                    const state =
                      isCorrect ? "bg-green-100 border-green-400" :
                        isSelected && !isCorrect ? "bg-red-100 border-red-400" :
                          "bg-slate-50 border-transparent";
                    return (
                      <button
                        key={i}
                        className={`w-full text-left rounded-xl px-4 py-3 border ${state}`}
                        disabled
                      >
                        <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border bg-white">{RU_LETTERS[i] ?? "•"}</span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 text-sm">
                  {check?.is_correct ? (
                    <span className="text-green-700">Correct • +{check.points} pts</span>
                  ) : (
                    <span className="text-red-700">
                      Incorrect{check?.correct_answer ? ` • Correct: ${check.correct_answer}` : ""}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-xl border px-4 py-2"
          >
            Back
          </button>
          <button
            onClick={() => { setResult(null); setTimeLeft(test.time_limit * 60); setAnswers({}); setCurrentIdx(0); }}
            className="rounded-xl bg-slate-900 text-white px-4 py-2"
          >
            Retake
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold">{test.test_title}</div>
          <div className="text-slate-500">{test.description}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm">
            Passing: <b>{test.passing_score}%</b>
          </div>
          {timeLeft !== null && (
            <div className="rounded-xl bg-slate-900 text-white px-3 py-2 text-sm">
              ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </div>
          )}
        </div>
      </div>

      {test.previous_attempt && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
          Previous attempt: {test.previous_attempt.percentage}% • {test.previous_attempt.passed ? "passed" : "failed"} •{" "}
          <span className="opacity-70">{new Date(test.previous_attempt.completed_at).toLocaleString()}</span>
        </div>
      )}

      {/* Card like in your mock */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-slate-900 text-xl font-semibold">Вопрос?</div>
          <div className="text-slate-500">{progress}</div>
        </div>

        {/* Options */}
        <div className="mt-4 space-y-3">
          {q?.options.map((opt, i) => {
            const selected = answers[q.question_id] === opt;
            return (
              <button
                key={i}
                onClick={() => handleSelect(q.question_id, opt)}
                className={`w-full rounded-2xl px-4 py-4 text-left transition border ${
                  selected
                    ? "bg-rose-400 text-white border-rose-500"
                    : "bg-slate-50 hover:bg-slate-100 border-transparent"
                }`}
              >
                <span className={`mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border ${selected ? "bg-white text-slate-900" : "bg-white"}`}>
                  {RU_LETTERS[i] ?? "•"}
                </span>
                <span className="align-middle">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            <button onClick={handlePrev} className="rounded-full border px-3 py-2">←</button>
            <button onClick={handleNext} className="rounded-full border px-3 py-2">→</button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="rounded-xl border px-4 py-2"
            >
              Пропустить
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl bg-slate-900 text-white px-4 py-2 disabled:opacity-50"
            >
              {submitting ? "Отправка…" : "Завершить тест"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;