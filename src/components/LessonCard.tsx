"use client";
import React, {useState} from "react";
import {UILesson} from "./CourseCreateProgram";
import {fmtDuration} from "./CourseCreateProgram";
import {ContentType, LessonKind} from "@/types/course";
import {Icon} from "@iconify/react/dist/iconify.js";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useSession} from "@/lib/useSession";
import {CourseService} from "@/services/course";
import toast from "react-hot-toast";
import {useParams} from "next/navigation";
import TestQuestionsModal from "@/components/TestQuestionsModal";

interface Props {
  lesson: UILesson;
  isOpen: boolean;
  lessonsCount: number;
  onToggle: () => void;
  onChange: (patch: Partial<UILesson>) => void;
  onDelete: () => void;
  moduleId?: number;
}

const LessonCard: React.FC<Props> = ({
                                       lesson,
                                       isOpen,
                                       lessonsCount,
                                       onToggle,
                                       onChange,
                                       onDelete,
                                       moduleId
                                     }) => {
  const {session} = useSession();
  const {courseId} = useParams();
  const course_id = Array.isArray(courseId) ? courseId[0] : courseId ?? "";
  const queryClient = useQueryClient();
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [testId, setTestId] = useState<number | null>(lesson.test_id ?? null);

  const isPersisted = lesson.id > 0; // > 0 — уже есть в БД, < 0 — временный

  // создание урока
  const {mutate: createLesson, isPending: creatingLesson} = useMutation({
    mutationFn: (payload: {
      moduleId: number;
      title: string;
      content: string;
      duration: number;
      lessonType: LessonKind;
      video_url?: string | null;
      order: number;
    }) => CourseService.createLesson(payload, session!.token),
    onSuccess: async () => {
      toast.success("Урок сохранён");
      await queryClient.invalidateQueries({
        queryKey: ["course", course_id, session?.token],
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Ошибка сохранения урока");
    },
  });
  // обновление урока
  const {mutate: updateLesson, isPending: updatingLesson} = useMutation({
    mutationFn: (payload: {
      moduleId: number;
      title: string;
      content: string;
      duration: number;
      lessonType: LessonKind;
      video_url?: string | null;
      order: number;
      testId: number | null,   // 👈
    }) => CourseService.updateLesson(lesson.id, payload, session!.token),
    onSuccess: async () => {
      toast.success("Изменения сохранены");
      await queryClient.invalidateQueries({
        queryKey: ["course", course_id, session?.token],
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Ошибка сохранения изменений");
    },
  });
  // удаление урока
  const {mutate: deleteLesson, isPending: deletingLesson} = useMutation({
    mutationFn: (lessonId: number) =>
      CourseService.deleteLesson(lessonId, session!.token),
    onSuccess: async () => {
      toast.success("Урок удалён");
      await queryClient.invalidateQueries({
        queryKey: ["course", course_id, session?.token],
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Ошибка удаления урока");
    },
  });
  const {mutateAsync: createTest, isPending: creatingTest} = useMutation({
    mutationFn: (payload: {
      title: string;
      description?: string;
      lessonId: number;
      timeLimit?: number;
      passingScore?: number;
    }) => CourseService.createTest(payload, session!.token),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["course", course_id, session?.token],
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Ошибка создания теста");
    },
  });

  const handleSaveNew = () => {
    if (!lesson.title.trim()) {
      toast.error("Введите название урока");
      return;
    }
    if (!moduleId || moduleId < 1) {
      toast.error("Сначала сохраните модуль");
      return;
    }

    createLesson({
      moduleId: moduleId,
      title: lesson.title.trim(),
      content: lesson.content || "",
      duration: lesson.duration || 0,
      lessonType: lesson.lesson_type!,
      video_url: lesson.video_url ?? null,
      order: lessonsCount, // аналогично модулям
    });
  };

  const handleSaveExisting = () => {
    if (!lesson.title.trim()) {
      toast.error("Введите название урока");
      return;
    }
    if (!moduleId || moduleId < 1) {
      toast.error("Сначала сохраните модуль");
      return;
    }

    updateLesson({
      moduleId,
      title: lesson.title.trim(),
      content: lesson.content || "",
      duration: lesson.duration || 0,
      lessonType: lesson.lesson_type!,
      video_url: lesson.video_url ?? null,
      order: lesson.order ?? 1,
      testId: lesson.test_id ?? null,   // 👈
    });
  };

  const handleDeleteClick = () => {
    if (!isPersisted) {
      // только из стейта
      onDelete();
      return;
    }

    deleteLesson(lesson.id);
  };

  const handleOpenQuestionsModal = async () => {
    if (!isPersisted) {
      toast.error("Сначала сохраните урок");
      return;
    }
    if (!moduleId || moduleId < 1) {
      toast.error("Сначала сохраните модуль");
      return;
    }
    if (!session?.token) {
      toast.error("Нет активной сессии");
      return;
    }

    let currentTestId = testId;

    // если тест ещё не создан — создаём и привязываем к уроку
    if (!currentTestId) {
      try {
        const test = await createTest({
          title: `Тест к уроку "${lesson.title || ""}"`,
          description: "Автоматически созданный тест",
          lessonId: lesson.id,
          timeLimit: 30,
          passingScore: 70,
        });

        const newTestId = test.id as number;
        currentTestId = newTestId;
        setTestId(newTestId);
        onChange({test_id: newTestId});

        // сразу обновим урок на бэке, чтобы lesson.testId был проставлен
        updateLesson({
          moduleId,
          title: lesson.title.trim(),
          content: lesson.content || "",
          duration: lesson.duration || 0,
          lessonType: lesson.lesson_type!,
          video_url: lesson.video_url ?? null,
          order: lesson.order ?? 1,
          testId: newTestId,
        });
      } catch (e) {
        // ошибки уже обработаны в onError
        return;
      }
    }

    setIsQuestionsModalOpen(true);
  };


  return (
    <>
      <div
        className={`w-full flex flex-col gap-4 rounded-[8px] p-4 border ${
          isOpen ? "border-[#F7A1A1] bg-[#FFF7F6]" : "border-gray-200"
        }`}
      >
        <button onClick={onToggle} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon={"material-symbols:menu-rounded"} className={"w-7 h-7 p-1"}/>

            <p className="text-sm">
              {lesson.title}{" "}
              <span className="ml-2 text-xs text-gray-500">
              {fmtDuration(lesson.duration)}
            </span>
            </p>
          </div>
          <span className="text-gray-400">{isOpen ? "▾" : "▸"}</span>
        </button>

        {isOpen && (
          <div className="flex flex-col gap-6 p-4 bg-white border border-[#E5E7EB] rounded-[8px]">
            <div>
              <label className="block text-xs text-black mb-2">Название</label>
              <input
                value={lesson.title}
                onChange={(e) => onChange({title: e.target.value})}
                className="w-full rounded-lg border border-[#E5E7EB] px-3.5 py-2.5 text-sm outline-none focus:border-[#EE7A67] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs text-black mb-2">Описание</label>
              <textarea
                value={lesson.content || ""}
                onChange={(e) => onChange({content: e.target.value})}
                rows={3}
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#EE7A67]"
              />
            </div>

            <div>
              <label className="block text-xs text-black mb-2">Тип контента</label>
              <div className="flex gap-3 flex-wrap">
                {(
                  [
                    "VIDEO",
                    "READING",
                    "TEST",
                    // "ASSIGNMENT",
                    // "LIVE_SESSION",
                    // "QUIZ",
                  ] as LessonKind[]
                ).map((kind) => {
                  const active = lesson.lesson_type === kind;
                  return (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => onChange({lesson_type: kind})}
                      className={`rounded-xl border px-4 py-3 text-sm ${
                        active
                          ? "border-[#F7A1A1] bg-[#FFF2F2] text-[#EE7A67]"
                          : "border-[#E5E7EB] text-gray-700 hover:border-[#F7A1A1]"
                      }`}
                    >
                      {kind === "VIDEO" && "Видео"}
                      {kind === "READING" && "Теория"}
                      {kind === "TEST" && "Тест"}
                      {/*{kind === "ASSIGNMENT" && "Задание"}*/}
                      {/*{kind === "LIVE_SESSION" && "Живой урок"}*/}
                      {/*{kind === "QUIZ" && "Квиз"}*/}
                    </button>
                  );
                })}
              </div>
            </div>

            {(lesson.lesson_type === "VIDEO" ||
              lesson.lesson_type === "LIVE_SESSION") && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Введите ссылку (YouTube/Vimeo или файл)
                </label>
                <input
                  value={lesson.video_url ?? ""}
                  onChange={(e) => onChange({video_url: e.target.value})}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#EE7A67]"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500">Длительность (сек)</label>
                <input
                  type="number"
                  min={0}
                  value={lesson.duration}
                  onChange={(e) =>
                    onChange({duration: Math.max(0, Number(e.target.value || 0))})
                  }
                  className="w-28 rounded-lg border border-gray-200 px-2 py-1 text-sm outline-none focus:border-[#EE7A67]"
                />
              </div>

              <div className="flex gap-2">
                {isPersisted ? (
                  <>
                    <button
                      type="button"
                      onClick={handleDeleteClick}
                      disabled={deletingLesson}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      {deletingLesson ? "Удаление..." : "Удалить урок"}
                    </button>
                    {lesson.lesson_type === "TEST" && (
                      <button
                        type="button"
                        onClick={handleOpenQuestionsModal}
                        disabled={creatingTest || updatingLesson}
                        className="rounded-lg border border-indigo-200 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 disabled:opacity-60"
                      >
                        {creatingTest
                          ? "Создание теста..."
                          : testId
                            ? "Редактировать вопросы"
                            : "Создать вопросы"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleSaveExisting}
                      disabled={updatingLesson}
                      className="rounded-lg bg-[#EE7A67] px-3 py-2 text-sm text-white hover:opacity-95 disabled:opacity-60"
                    >
                      {updatingLesson ? "Сохранение..." : "Сохранить изменения"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleDeleteClick}
                      disabled={deletingLesson}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      Убрать урок
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNew}
                      disabled={creatingLesson}
                      className="rounded-lg bg-[#EE7A67] px-3 py-2 text-sm text-white hover:opacity-95 disabled:opacity-60"
                    >
                      {creatingLesson ? "Сохранение..." : "Сохранить"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <TestQuestionsModal
        isOpen={isQuestionsModalOpen}
        onClose={() => setIsQuestionsModalOpen(false)}
        testId={testId}
      />
    </>
  );
};

export default LessonCard;
