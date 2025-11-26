"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSession } from "@/lib/useSession";
import { useParams } from "next/navigation";
import { CourseService } from "@/services/course";

interface TestQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  testId: number | null;
}

// локальная модель
type QuestionForm = {
  id: number;             // локальный id для key / навигации
  backendId?: number;     // реальный id в БД (undefined = новый вопрос)
  text: string;
  options: string[];      // всегда 4 варианта
  correctIndex: number;   // индекс правильного варианта
  points: number;
  order: number;
};

const makeEmptyQuestion = (order: number): QuestionForm => ({
  id: Date.now() + Math.random(),
  backendId: undefined,
  text: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  points: 1,
  order,
});

const TestQuestionsModal: React.FC<TestQuestionsModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 testId,
                                                               }) => {
  const { session } = useSession();
  const { courseId } = useParams();
  const course_id = Array.isArray(courseId) ? courseId[0] : courseId ?? "";

  const [questions, setQuestions] = useState<QuestionForm[]>([makeEmptyQuestion(1)]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // --- Мутации ---

  const {
    mutateAsync: createQuestion,
    isPending: creating,
  } = useMutation({
    mutationFn: (payload: {
      testId: number;
      question: {
        questionText: string;
        questionType: string;
        options: string[];
        correctAnswer: string;
        points: number;
        questionOrder: number;
      };
    }) =>
      CourseService.createTestQuestion(
        payload.testId,
        payload.question,
        session!.token
      ),
    onError: (err: any) => {
      toast.error(err?.message || "Ошибка создания вопроса");
    },
  });

  const {
    mutateAsync: updateQuestion,
    isPending: updating,
  } = useMutation({
    mutationFn: (payload: {
      testId: number;
      questionId: number;
      data: {
        questionText?: string;
        questionType?: "multiple_choice" | "true_false" | "text";
        options?: string[];
        correctAnswer?: string;
        points?: number;
        questionOrder?: number;
      };
    }) =>
      CourseService.updateTestQuestion(
        payload.testId,
        payload.questionId,
        payload.data,
        session!.token
      ),
    onError: (err: any) => {
      toast.error(err?.message || "Ошибка обновления вопроса");
    },
  });

  const {
    mutateAsync: removeQuestion,
    isPending: deleting,
  } = useMutation({
    mutationFn: (payload: { testId: number; questionId: number }) =>
      CourseService.deleteTestQuestion(
        payload.testId,
        payload.questionId,
        session!.token
      ),
    onError: (err: any) => {
      toast.error(err?.message || "Ошибка удаления вопроса");
    },
  });

  const saving = creating || updating;

  // --- загрузка вопросов при открытии модалки ---
  useEffect(() => {
    if (!isOpen || !testId || !session?.token) return;

    let cancelled = false;

    const loadQuestions = async () => {
      try {
        setLoadingQuestions(true);
        const backendQuestions = await CourseService.getTestQuestions(
          testId,
          session.token
        );

        if (cancelled) return;

        if (backendQuestions && backendQuestions.length > 0) {
          const mapped: QuestionForm[] = backendQuestions.map((q, idx) => {
            const opts = Array.isArray(q.options) && q.options.length > 0
              ? q.options
              : ["", "", "", ""];
            const correctIndex = Math.max(
              0,
              opts.findIndex((opt) => opt === q.correct_answer)
            );

            return {
              id: q.id, // локальный id = id из БД, ок
              backendId: q.id,
              text: q.question_text,
              options: opts.length === 4 ? opts : [...opts.slice(0, 4), ...Array(4 - opts.length).fill("")],
              correctIndex: correctIndex === -1 ? 0 : correctIndex,
              points: q.points ?? 1,
              order: q.question_order ?? idx + 1,
            };
          });

          setQuestions(mapped);
          setCurrentIndex(0);
        } else {
          // если вопросов нет — один пустой вопрос
          setQuestions([makeEmptyQuestion(1)]);
          setCurrentIndex(0);
        }

        setIsDirty(false);
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message || "Ошибка загрузки вопросов");
      } finally {
        if (!cancelled) setLoadingQuestions(false);
      }
    };

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [isOpen, testId, session?.token]);

  if (!isOpen) return null;

  const currentQuestion = questions[currentIndex];

  // --- helpers ---

  const validateCurrentQuestion = (q: QuestionForm, indexLabel: number) => {
    if (!testId) {
      toast.error("Сначала создайте тест");
      return false;
    }

    if (!session?.token) {
      toast.error("Нет активной сессии");
      return false;
    }

    if (!q.text.trim()) {
      toast.error(`Заполните текст вопроса ${indexLabel}`);
      return false;
    }

    if (q.text.trim().length < 5) {
      toast.error(`Текст вопроса ${indexLabel} должен быть не короче 5 символов`);
      return false;
    }

    if (q.options.some((opt) => !opt.trim())) {
      toast.error(`Заполните все варианты ответа в вопросе ${indexLabel}`);
      return false;
    }

    if (
      q.correctIndex < 0 ||
      q.correctIndex >= q.options.length ||
      !q.options[q.correctIndex].trim()
    ) {
      toast.error(`Выберите корректный правильный ответ в вопросе ${indexLabel}`);
      return false;
    }

    return true;
  };

  const handleChangeQuestionText = (value: string) => {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === currentIndex ? { ...q, text: value } : q
      )
    );
    setIsDirty(true);
  };

  const handleChangeOption = (optionIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== currentIndex) return q;
        const options = [...q.options];
        options[optionIndex] = value;
        return { ...q, options };
      })
    );
    setIsDirty(true);
  };

  const handleSetCorrectIndex = (idx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === currentIndex ? { ...q, correctIndex: idx } : q
      )
    );
    setIsDirty(true);
  };

  const handleChangePoints = (value: number) => {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === currentIndex ? { ...q, points: value } : q
      )
    );
    setIsDirty(true);
  };

  const hasUnsaved = questions.some((q) => !q.backendId); // есть хотя бы один новый вопрос

  const handleAddQuestion = () => {
    // нельзя создавать новый, пока есть несохранённый
    if (hasUnsaved) {
      toast.error("Сначала сохраните текущий новый вопрос");
      return;
    }

    setQuestions((prev) => {
      const order = prev.length + 1;
      const next = [...prev, makeEmptyQuestion(order)];
      setCurrentIndex(next.length - 1);
      return next;
    });
    setIsDirty(true);
  };

  const handleDeleteCurrentQuestion = async () => {
    const q = currentQuestion;

    // если вопрос ещё не сохранён — просто убираем из стейта
    if (!q.backendId) {
      if (questions.length === 1) {
        setQuestions([makeEmptyQuestion(1)]);
        setCurrentIndex(0);
      } else {
        setQuestions((prev) => {
          const next = prev.filter((_, idx) => idx !== currentIndex);
          const newIndex =
            currentIndex >= next.length ? next.length - 1 : currentIndex;
          setCurrentIndex(newIndex);
          return next;
        });
      }
      setIsDirty(false);
      return;
    }

    if (!testId) return;

    const ok = window.confirm("Удалить этот вопрос?");
    if (!ok) return;

    try {
      await removeQuestion({ testId, questionId: q.backendId });

      setQuestions((prev) => {
        const next = prev.filter((item) => item.backendId !== q.backendId);
        if (next.length === 0) {
          const single = makeEmptyQuestion(1);
          setCurrentIndex(0);
          return [single];
        }
        const newIndex =
          currentIndex >= next.length ? next.length - 1 : currentIndex;
        setCurrentIndex(newIndex);
        return next;
      });

      toast.success("Вопрос удалён");
      setIsDirty(false);
    } catch (e) {
      // ошибка уже обработана в onError
    }
  };

  const handleSave = async () => {
    if (!testId) return;

    const q = currentQuestion;
    const indexLabel = currentIndex + 1;

    if (!validateCurrentQuestion(q, indexLabel)) return;

    const payload = {
      questionText: q.text.trim(),
      questionType: "multiple_choice" as const,
      options: q.options.map((o) => o.trim()),
      correctAnswer: q.options[q.correctIndex].trim(),
      points: q.points || 1,
      questionOrder: q.order || indexLabel,
    };

    try {
      if (q.backendId) {
        // обновление существующего вопроса
        const updated = await updateQuestion({
          testId,
          questionId: q.backendId,
          data: payload,
        });

        setQuestions((prev) =>
          prev.map((item, idx) =>
            idx === currentIndex
              ? {
                ...item,
                text: updated.question_text,
                options: updated.options,
                correctIndex: Math.max(
                  0,
                  updated.options.findIndex(
                    (opt: string) => opt === updated.correct_answer
                  )
                ),
                points: updated.points ?? 1,
                order: updated.question_order ?? item.order,
              }
              : item
          )
        );
        toast.success("Изменения вопроса сохранены");
      } else {
        // создание нового вопроса
        const created = await createQuestion({
          testId,
          question: payload,
        });

        setQuestions((prev) =>
          prev.map((item, idx) =>
            idx === currentIndex
              ? {
                ...item,
                backendId: created.id,
                id: created.id,
                text: created.question_text,
                options: created.options,
                correctIndex: Math.max(
                  0,
                  created.options.findIndex(
                    (opt: string) => opt === created.correct_answer
                  )
                ),
                points: created.points ?? 1,
                order: created.question_order ?? item.order,
              }
              : item
          )
        );
        toast.success("Вопрос создан");
      }

      setIsDirty(false);
    } catch (e) {
      // ошибки уже обработаны в onError
    }
  };

  const handleCloseClick = () => {
    if ((isDirty || saving || deleting) && !loadingQuestions) {
      const confirmClose = window.confirm(
        "Есть несохранённые изменения. Закрыть без сохранения?"
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              Вопросы теста {testId ? `#${testId}` : ""}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Тип теста: множественный выбор с одним верным вариантом.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCloseClick}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
          >
            <Icon icon="mdi:close" className="h-5 w-5" />
          </button>
        </div>

        {!testId ? (
          <p className="text-sm text-gray-500">
            Тест ещё не создан. Вернитесь к уроку и нажмите &laquo;Создать вопросы&raquo;.
          </p>
        ) : loadingQuestions ? (
          <p className="text-sm text-gray-500">Загрузка вопросов...</p>
        ) : (
          <>
            {/* Навигация по вопросам */}
            <div className="mb-4 flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`rounded-full px-3 py-1 text-xs border ${
                      isActive
                        ? "border-[#EE7A67] bg-[#FFF2F2] text-[#EE7A67]"
                        : "border-gray-200 text-gray-600 hover:border-[#EE7A67]"
                    }`}
                  >
                    Вопрос {idx + 1}
                    {!q.backendId && " *"}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleAddQuestion}
                disabled={hasUnsaved}
                className="ml-1 inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs text-[#EE7A67] hover:bg-[#FFF7F6] disabled:opacity-50"
              >
                <Icon icon="uil:plus" className="h-4 w-4" />
                Добавить вопрос
              </button>
            </div>

            {/* Форма текущего вопроса */}
            <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              {/* Текст вопроса */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Текст вопроса
                </label>
                <textarea
                  value={currentQuestion.text}
                  onChange={(e) => handleChangeQuestionText(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
                  placeholder="Введите текст вопроса..."
                />
              </div>

              {/* Варианты ответа */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700">
                  Варианты ответа (выберите один правильный)
                </label>
                <div className="space-y-2">
                  {currentQuestion.options.map((opt, idx) => {
                    const isCorrect = currentQuestion.correctIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                          isCorrect
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="correct-option"
                          checked={isCorrect}
                          onChange={() => handleSetCorrectIndex(idx)}
                          className="h-4 w-4 cursor-pointer text-emerald-600"
                        />
                        <input
                          value={opt}
                          onChange={(e) =>
                            handleChangeOption(idx, e.target.value)
                          }
                          className="flex-1 rounded-md border border-transparent bg-transparent text-sm outline-none"
                          placeholder={`Вариант ${idx + 1}`}
                        />
                        {isCorrect && (
                          <span className="text-[10px] font-semibold uppercase text-emerald-600">
                            Правильный
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Баллы и удаление */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600">
                    Баллы за вопрос
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={currentQuestion.points}
                    onChange={(e) =>
                      handleChangePoints(
                        Math.max(1, Number(e.target.value || 1))
                      )
                    }
                    className="w-20 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm outline-none focus:border-[#EE7A67]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleDeleteCurrentQuestion}
                  disabled={deleting}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  <Icon icon="mdi:trash-can-outline" className="h-4 w-4" />
                  {deleting ? "Удаление..." : "Удалить вопрос"}
                </button>
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseClick}
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-[#EE7A67] px-5 py-2 text-xs font-medium text-white hover:opacity-95 disabled:opacity-60"
              >
                {saving
                  ? "Сохранение..."
                  : currentQuestion.backendId
                    ? "Сохранить изменения"
                    : "Создать вопрос"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TestQuestionsModal;
