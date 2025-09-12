"use client";
import React from "react";
import { UILesson } from "./CourseCreateProgram";
import { fmtDuration } from "./CourseCreateProgram";
import {ContentType} from "@/types/course";

interface Props {
  lesson: UILesson;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<UILesson>) => void;
  onDelete: () => void;
}

const LessonCard: React.FC<Props> = ({ lesson, isOpen, onToggle, onChange, onDelete }) => {
  return (
    <div className={`rounded-xl border ${isOpen ? "border-[#F7A1A1] bg-[#FFF7F6]" : "border-gray-200"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="i-lucide-grip-vertical" />
          <span className="text-[#EE7A67]">●</span>
          <p className="text-sm">
            {lesson.title}{" "}
            <span className="ml-2 text-xs text-gray-500">{fmtDuration(lesson.duration)}</span>
          </p>
        </div>
        <span className="text-gray-400">{isOpen ? "▾" : "▸"}</span>
      </button>

      {isOpen && (
        <div className="px-3 pb-3">
          <div className="grid gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Название</label>
              <input
                value={lesson.title}
                onChange={(e) => onChange({ title: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#EE7A67]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Описание</label>
              <textarea
                value={lesson.content || ""}
                onChange={(e) => onChange({ content: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#EE7A67]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2">Тип контента</label>
              <div className="flex gap-3 flex-wrap">
                {(["video", "text", "quiz", "download"] as ContentType[]).map((t) => {
                  const active = lesson.content_type === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onChange({ content_type: t })}
                      className={`rounded-xl border px-4 py-3 text-sm ${
                        active
                          ? "border-[#F7A1A1] bg-[#FFF2F2] text-[#EE7A67]"
                          : "border-gray-200 text-gray-700 hover:border-[#F7A1A1]"
                      }`}
                    >
                      {t === "video" && "Видео"}
                      {t === "text" && "Текстовое"}
                      {t === "quiz" && "Тестирование"}
                      {t === "download" && "Материал для скачивания"}
                    </button>
                  );
                })}
              </div>
            </div>

            {(lesson.content_type === "video" || lesson.content_type === "download") && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Введите ссылку (YouTube/Vimeo или файл)
                </label>
                <input
                  value={lesson.video_url ?? ""}
                  onChange={(e) => onChange({ video_url: e.target.value })}
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
                    onChange({ duration: Math.max(0, Number(e.target.value || 0)) })
                  }
                  className="w-28 rounded-lg border border-gray-200 px-2 py-1 text-sm outline-none focus:border-[#EE7A67]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Удалить урок
                </button>
                <button
                  type="button"
                  onClick={onToggle}
                  className="rounded-lg bg-[#EE7A67] px-3 py-2 text-sm text-white hover:opacity-95"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonCard;
