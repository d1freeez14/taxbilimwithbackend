'use client'

import {useSession} from "@/lib/useSession";
import {TestService} from "@/services/test";
import {AttemptsResponse, SubmitAnswer, SubmitResponse, TestPayload} from "@/types/test";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";

const RU_LETTERS = ["A", "Б", "В", "Г", "Д", "Е"];
type Mode = "attempts" | "take" | "review";

const TestPage = () => {
  const {getSession} = useSession();
  const session = getSession();
  const {testId} = useParams();
  const test_id = Array.isArray(testId) ? testId[0] : testId || "";
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("take");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // seconds
  const [result, setResult] = useState<SubmitResponse | null>(null);


  const {data, isLoading, isError, error} = useQuery<TestPayload>({
    queryKey: ["test", test_id, session?.token],
    queryFn: () => TestService.getTestById(test_id, session!.token!),
    enabled: Boolean(session?.token && test_id),
  });
  const {
    data: attemptsData,
    isLoading: attemptsLoading,
    isError: attemptsError,
    refetch: refetchAttempts
  } = useQuery<AttemptsResponse>({
    queryKey: ["test_attempts", test_id, session?.token],
    queryFn: () => TestService.getAttempts(test_id, session!.token!),
    enabled: Boolean(session?.token && test_id),
  });

  useEffect(() => {
    if (!attemptsLoading && attemptsData?.attempts?.length) {
      setMode("attempts");
    }
  }, [attemptsLoading, attemptsData?.attempts?.length]);

  // start timer on load
  // useEffect(() => {
  //   if (!data?.test?.time_limit) return;
  //   setTimeLeft(data.test.time_limit * 60);
  // }, [data?.test?.time_limit]);

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

  const {mutate: submit, isPending: submitting} = useMutation({
    mutationFn: (payload: SubmitAnswer[]) => TestService.submitTestAnswers(test_id, session!.token!, payload),
    onSuccess: async () => {
      toast.success("Попытка отправлена");

      setAnswers({});
      setCurrentIdx(0);
      if (test?.time_limit) setTimeLeft(test.time_limit * 60);

      await refetchAttempts();
      setMode("attempts");
    },
    onError: (e: any) => {
      toast.error(e?.message || "Не удалось отправить ответы");
    }
  });

  const handleSelect = (questionId: number, value: string) => {
    setAnswers((prev) => ({...prev, [questionId]: value}));
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

  function handleSubmit() {
    if (!questions.length || submitting) return;

    const unanswered = questions.filter(qq => !(answers[qq.id] && answers[qq.id].trim().length));
    if (unanswered.length > 0) {
      toast.error(`Ответьте ещё на ${unanswered.length} из ${questions.length} вопросов`);
      return;
    }

    const payload: SubmitAnswer[] = questions.map((qq) => ({
      questionId: qq.id,
      answer: answers[qq.id],
    }));
    submit(payload);
  }

  if (isLoading || attemptsLoading) {
    return <div className="w-full p-6">Загрузка…</div>;
  }
  if (isError) {
    return <div className="w-full p-6 text-red-600">Error: {(error as Error)?.message || "Failed to load test"}</div>;
  }
  if (!test) {
    return <div className="w-full p-6">No test found.</div>;
  }

  if (mode === "attempts" && attemptsData?.attempts?.length) {
    const attempts = [...attemptsData.attempts].sort(
      (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    );
    const latest = attempts[0];

    return (
      <div className="w-full">
        <h1 className="text-xl font-semibold mb-3">Ваши попытки</h1>
        <div className="w-full h-full flex flex-col gap-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="text-sm text-slate-600">Последняя попытка</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className={`px-2 py-1 rounded ${latest.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {latest.passed ? "Зачёт" : "Незачёт"}
                </span>
                <span
                  className="text-sm">Баллы: <b>{latest.score}</b>{latest.maxScore ? ` / ${latest.maxScore}` : ""}</span>
                <span
                  className="text-sm">• {typeof latest.percentage === "string" ? latest.percentage : `${latest.percentage.toFixed(2)}%`}</span>
                <span className="text-sm opacity-70">• {new Date(latest.completed_at).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setMode("take");
                setResult(null);
                setAnswers({});
                setCurrentIdx(0);
                if (test?.time_limit) setTimeLeft(test.time_limit * 60);
              }}
              className="rounded-lg border px-4 py-2"
            >
              Начать новую попытку
            </button>
          </div>

          <div className="">
            <div className="text-sm font-medium mb-2">Все попытки</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-300 border-collapse">
                <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 px-4 border border-slate-300 w-[50px]">#</th>
                  <th className="py-2 px-4 border border-slate-300">Статус</th>
                  <th className="py-2 px-4 border border-slate-300">Баллы</th>
                  <th className="py-2 px-4 border border-slate-300">Процент</th>
                  <th className="py-2 px-4 border border-slate-300">Завершено</th>
                </tr>
                </thead>
                <tbody>
                {attempts.map((a, i) => (
                  <tr key={a.id}>
                    <td className="py-2 px-4 border border-slate-300 w-[50px]">{i + 1}</td>
                    <td className="py-2 px-4 border border-slate-300">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          a.passed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {a.passed ? "Зачёт" : "Незачёт"}
                      </span>
                    </td>
                    <td className="py-2 px-4 border border-slate-300">
                      {a.score}
                      {a.maxScore ? ` / ${a.maxScore}` : ""}
                    </td>
                    <td className="py-2 px-4 border border-slate-300">
                      {typeof a.percentage === "string"
                        ? a.percentage
                        : `${a.percentage.toFixed(2)}%`}
                    </td>
                    <td className="py-2 px-4 border border-slate-300">
                      {new Date(a.completed_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
            {/*<p className="mt-3 text-xs text-slate-500">*/}
            {/*  Подсказка: вы можете открыть подробный разбор последней попытки или начать новую.*/}
            {/*</p>*/}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full">
      {/* Header */}
      {/*<div className="mb-5 flex items-center justify-between">*/}
      {/*  <div>*/}
      {/*    <div className="text-2xl font-semibold">{test.test_title}</div>*/}
      {/*    <div className="text-slate-500">{test.description}</div>*/}
      {/*  </div>*/}
      {/*  <div className="flex items-center gap-4">*/}
      {/*    <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm">*/}
      {/*      Passing: <b>{test.passing_score}%</b>*/}
      {/*    </div>*/}
      {/*    {timeLeft !== null && (*/}
      {/*      <div className="rounded-xl bg-slate-900 text-white px-3 py-2 text-sm">*/}
      {/*        ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}*/}
      {/*      </div>*/}
      {/*    )}*/}
      {/*  </div>*/}
      {/*</div>*/}

      {test.previous_attempt && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
          Previous attempt: {test.previous_attempt.percentage}%
          • {test.previous_attempt.passed ? "passed" : "failed"} •{" "}
          <span className="opacity-70">{new Date(test.previous_attempt.completed_at).toLocaleString()}</span>
        </div>
      )}

      {/* Card like in your mock */}
      <div className="bg-white p-6">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-black text-[24px] font-semibold">{q.question_text}</h1>
          <h1 className="text-black text-[24px] font-semibold">{progress}</h1>
        </div>

        {/* Options */}
        <div className="mt-4 space-y-3">
          {q.options.map((opt, i) => {
            const selected = answers[q.id] === opt;
            return (
              <button
                key={i}
                onClick={() => handleSelect(q.id, opt)}
                className={`w-full flex items-center gap-3 rounded-[16px] p-3 transition ${
                  selected
                    ? "bg-[#EE7A67] text-white"
                    : "bg-[#FAFAFA] hover:bg-slate-100"
                }`}
              >
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[14px] border  ${selected ? "text-white border-white" : "text-[#1A1D1F] border-[#1A1D1F]"}`}>
                  {RU_LETTERS[i] ?? "•"}
                </span>
                <span className="text-[16px]">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-end">
          <div className="flex gap-2">
            {currentIdx !== 0 && (
              <button onClick={handlePrev}
                      className="rounded-[8px] border border-[#EAECF0] text-[14px] font-semibold px-5 py-3 ">Назад
              </button>
            )}
            {currentIdx !== questions.length - 1 && (
              <button onClick={handleNext}
                      className="rounded-[8px] border border-[#EAECF0] text-[14px] font-semibold px-5 py-3 ">Далее
              </button>
            )}
            {currentIdx === questions.length - 1 && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-[8px] border border-[#EAECF0] text-[14px] font-semibold px-5 py-3 disabled:opacity-50"
              >
                {submitting ? "Отправка…" : "Завершить тест"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;