"use client";
import React from "react";
import {fmtDuration, UIModule, UILesson} from "./CourseCreateProgram";
import LessonCard from "./LessonCard";

interface ModuleCardProps {
  module: UIModule;
  isOpen: boolean;
  onToggle: () => void;
  onTitleChange: (title: string) => void;
  onAddLesson: () => void;

  onDeleteModule: () => void;
  isLessonOpen: (lessonId: number) => boolean;
  onToggleLesson: (lessonId: number) => void;
  onUpdateLesson: (lessonId: number, patch: Partial<UILesson>) => void;
  onDeleteLesson: (lessonId: number) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
                                                 module,
                                                 isOpen,
                                                 onToggle,
                                                 onTitleChange,
                                                 onAddLesson,
                                                 isLessonOpen,
                                                 onToggleLesson,
                                                 onUpdateLesson,
                                                 onDeleteLesson,
                                                 onDeleteModule
                                               }) => {
  const moduleDuration = module.lessons.reduce((s, l) => s + (l.duration || 0), 0);

  return (
    <div className="rounded-2xl bg-white border border-[#F7A1A1]">
      {/* Header: input + duration + actions */}
      <div className="w-full flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="i-lucide-grip-vertical shrink-0" />
          <input
            value={module.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Название модуля"
            className="flex-1 min-w-0 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#EE7A67]"
          />
        </div>

        <div className="ml-3 flex items-center gap-3">
          <span className="text-xs font-normal text-gray-500">
            {fmtDuration(moduleDuration)}
          </span>

          <button
            type="button"
            onClick={onDeleteModule}
            className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
            aria-label="Удалить модуль"
          >
            Удалить модуль
          </button>

          <button
            type="button"
            onClick={onToggle}
            className="text-gray-400 text-base leading-none px-2 py-1"
            aria-label={isOpen ? "Свернуть" : "Развернуть"}
          >
            {isOpen ? "▾" : "▸"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-4">
          <div className="flex flex-col gap-3">
            {module.lessons.map((l) => (
              <LessonCard
                key={l.id}
                lesson={l}
                isOpen={isLessonOpen(l.id)}
                onToggle={() => onToggleLesson(l.id)}
                onChange={(patch) => onUpdateLesson(l.id, patch)}
                onDelete={() => onDeleteLesson(l.id)}
              />
            ))}

            <button
              type="button"
              onClick={onAddLesson}
              className="mt-1 w-full rounded-xl border border-dashed border-[#F7A1A1] px-4 py-4 text-sm text-[#EE7A67] hover:bg-[#FFF7F6]"
            >
              + Добавить новый урок
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
