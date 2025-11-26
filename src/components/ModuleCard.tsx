"use client";
import React, {useState} from "react";
import {fmtDuration, UIModule, UILesson} from "./CourseCreateProgram";
import LessonCard from "./LessonCard";
import {Icon} from "@iconify/react";
import {CourseService} from "@/services/course";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {useParams} from "next/navigation";
import {useSession} from "@/lib/useSession";

interface ModuleCardProps {
  module: UIModule;
  modulesCount: number;
  onTitleChange: (title: string) => void;
  onAddLesson: () => void;

  onRemoveModule: () => void;
  isLessonOpen: (lessonId: number) => boolean;
  onToggleLesson: (lessonId: number) => void;
  onUpdateLesson: (lessonId: number, patch: Partial<UILesson>) => void;
  onDeleteLesson: (lessonId: number) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
                                                 module,
                                                 modulesCount,
                                                 onTitleChange,
                                                 onAddLesson,
                                                 isLessonOpen,
                                                 onToggleLesson,
                                                 onUpdateLesson,
                                                 onDeleteLesson,
                                                 onRemoveModule,
                                               }) => {
// локальное состояние открытия модуля
  const [isOpen, setIsOpen] = useState(true);

  const {session, ready} = useSession();
  const { courseId } = useParams();
  const course_id = Array.isArray(courseId) ? courseId[0] : courseId ?? "";
  const queryClient = useQueryClient();

  const moduleDuration = module.lessons.reduce(
    (s, l) => s + (l.duration || 0),
    0
  );
  const isPersisted = module.id > 0; // > 0 — из бэка, < 0 — временный


  // Создание модуля
  const { mutate: createModule, isPending: creatingModule } = useMutation({
    mutationFn: (payload: { courseId: number; title: string; order: number; }) =>
      CourseService.createModule(payload, session!.token),
    onSuccess: async () => {
      toast.success("Модуль создан");
      await queryClient.invalidateQueries({
        queryKey: ["course", course_id, session?.token],
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Ошибка создания модуля");
    },
  });
  // Обновление модуля
  const { mutate: updateModule, isPending: updatingModule } = useMutation({
    mutationFn: (payload: { title: string; order: number }) =>
      CourseService.updateModule(module.id, payload, session!.token),
    onSuccess: async () => {
      toast.success("Изменения модуля сохранены");
      await queryClient.invalidateQueries({
        queryKey: ["course", course_id, session?.token],
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Ошибка сохранения изменений");
    },
  });
  // Удаление сохранённого модуля
  const { mutate: deleteModule, isPending: deletingModule } = useMutation({
    mutationFn: (moduleId: number) =>
      CourseService.deleteModule(moduleId, session!.token),
    onSuccess: async () => {
      toast.success("Модуль удалён");
      await queryClient.invalidateQueries({
        queryKey: ["course", course_id, session?.token],
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Ошибка удаления модуля");
    },
  });

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSave = () => {
    if (!module.title.trim()) {
      toast.error("Введите название модуля перед сохранением");
      return;
    }
    if (!course_id) {
      toast.error("course_id не найден");
      return;
    }

    if (!isPersisted) {
      // новый модуль
      createModule({
        courseId: Number(course_id),
        title: module.title.trim(),
        order: modulesCount, // длина модулей + 1 приходит сверху
      });
    } else {
      // обновление существующего
      updateModule({
        title: module.title.trim(),
        order: module.order ?? modulesCount, // можно оставить текущий order
      });
    }
  };

  const handleDeleteClick = () => {
    if (!isPersisted) {
      // модуль только в стейте — просто убираем его из массива
      onRemoveModule();
      return;
    }

    // модуль сохранён — удаляем через API
    deleteModule(module.id);
  };
  const saving = creatingModule || updatingModule;

  return (
    <div className="w-full flex flex-col gap-4 rounded-[8px] bg-white border-2 border-[#E5E7EB] p-4">
      {/* Header: input + duration + actions */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Icon icon={"material-symbols:menu-rounded"} className={"w-7 h-7 p-1"} />
          <input
            value={module.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Название модуля"
            className="flex-1 min-w-0 rounded-lg border border-[#E5E7EB] px-3.5 py-2.5 text-sm outline-none focus:border-[#EE7A67]"
          />
        </div>

        <div className="ml-3 flex items-center gap-3">
          <span className="text-xs font-normal text-gray-500">
            {fmtDuration(moduleDuration)}
          </span>

          {/* Сохранить / Сохранить изменения */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg border border-emerald-200 px-3 py-2 text-xs text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
          >
            {saving
              ? "Сохранение..."
              : isPersisted
                ? "Сохранить изменения"
                : "Сохранить"}
          </button>

          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={deletingModule}
            className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50 disabled:opacity-60"
            aria-label={isPersisted ? "Удалить модуль" : "Убрать модуль"}
          >
            {isPersisted
              ? deletingModule
                ? "Удаление..."
                : "Удалить модуль"
              : "Убрать модуль"}
          </button>

          <button
            type="button"
            onClick={handleToggle}
            className="text-gray-400 text-base leading-none"
            aria-label={isOpen ? "Свернуть" : "Развернуть"}
          >
            {!isOpen ? (
              <Icon icon={"famicons:chevron-down-outline"} className={"w-7 h-7 p-1"} />
            ) : (
              <Icon icon={"famicons:chevron-up-outline"} className={"w-7 h-7 p-1"} />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-3">
          {module.lessons.map((l) => (
            <LessonCard
              key={l.id}
              lesson={l}
              isOpen={isLessonOpen(l.id)}
              onToggle={() => onToggleLesson(l.id)}
              onChange={(patch) => onUpdateLesson(l.id, patch)}
              onDelete={() => onDeleteLesson(l.id)}
              moduleId={module.id > 0 ? module.id : undefined} // 👈 only pass valid id
              lessonsCount={module.lessons.length}   // 👈 вот это добавь
            />
          ))}

          <button
            type="button"
            onClick={onAddLesson}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#E5E7EB] p-6 text-sm text-[#EE7A67] hover:bg-[#FFF7F6]"
          >
            <Icon
              icon={"uil:plus"}
              className={
                "w-7 h-7 p-1 bg-[#FEF2F2] text-[#EE7A67] rounded-full"
              }
            />
            Добавить новый урок
          </button>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
