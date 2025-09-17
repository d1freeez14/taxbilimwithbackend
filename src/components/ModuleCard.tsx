"use client";
import React from "react";
import {fmtDuration, UIModule, UILesson} from "./CourseCreateProgram";
import LessonCard from "./LessonCard";
import {Icon} from "@iconify/react";

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
    <div className="w-full flex flex-col gap-4 rounded-[8px] bg-white border-2 border-[#E5E7EB] p-4">
      {/* Header: input + duration + actions */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Icon icon={'material-symbols:menu-rounded'} className={'w-7 h-7 p-1'}/>
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
            className="text-gray-400 text-base leading-none"
            aria-label={isOpen ? "Свернуть" : "Развернуть"}
          >
            {!isOpen ? (
              <Icon icon={'famicons:chevron-down-outline'} className={'w-7 h-7 p-1'}/>
            ) : (
              <Icon icon={'famicons:chevron-up-outline'} className={'w-7 h-7 p-1'}/>
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
            />
          ))}

          <button
            type="button"
            onClick={onAddLesson}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#E5E7EB] p-6 text-sm text-[#EE7A67] hover:bg-[#FFF7F6]"
          >
            <Icon icon={'uil:plus'} className={'w-7 h-7 p-1 bg-[#FEF2F2] text-[#EE7A67] rounded-full'}/>
            Добавить новый урок
          </button>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
