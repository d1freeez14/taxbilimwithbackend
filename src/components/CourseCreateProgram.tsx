"use client";

import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import CourseCreateStages from "@/components/CourseCreateStages";
import ModuleCard from "./ModuleCard";
import type {
  ContentType,
  CourseModule,
  Lesson,
  LessonKind,
  LessonPreview,
  ModuleLesson,
} from "@/types/course";

/** ---------- UI models (unify Lesson & LessonPreview) ---------- */
export type UILesson = {
  id: number;
  title: string;
  duration: number;
  order: number;

  // fields from Lesson (optional in UI)
  completed?: boolean;
  completed_at?: string | null;
  content?: string;
  course_id?: number;
  course_title?: string;
  module_id?: number;
  module_title?: string;
  created_at?: string;
  updated_at?: string;
  video_url?: string | null;
  content_type?: ContentType;

  // fields from LessonPreview (optional in UI)
  image?: string | null;
  locked?: boolean;
  lesson_type?: LessonKind;
  test_id?: number | null;
  url?: string | null;
};

export type UIModule = Omit<CourseModule, "lessons"> & {
  lessons: UILesson[];
};

/** ---------- Utils ---------- */
const uid = () => -Math.floor(Math.random() * 1e9);
const nowISO = () => new Date().toISOString();

export const fmtDuration = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}min ${String(s).padStart(2, "0")}s`;
};

const isFullLesson = (l: ModuleLesson): l is Lesson =>
  // any field unique to Lesson works
  "completed" in l || "course_id" in l;

const normalizeLesson = (l: ModuleLesson): UILesson => {
  if (isFullLesson(l)) {
    return {
      ...l,
      content_type: l.content_type ?? (l.video_url ? "video" : "text"),
    };
  }
  // LessonPreview -> fill reasonable defaults for edit UI
  const lp = l as LessonPreview;
  return {
    id: lp.id,
    title: lp.title,
    duration: lp.duration,
    order: lp.order,
    image: lp.image,
    locked: lp.locked,
    lesson_type: lp.lesson_type,
    test_id: lp.test_id,
    url: lp.url,
    // defaults so the edit UI can work
    content: "",
    video_url: lp.url ?? null,
    content_type: lp.lesson_type === "VIDEO" ? "video" : "text",
  };
};

const toUI = (mods: CourseModule[]): UIModule[] =>
  (mods ?? []).map((m) => ({
    ...m,
    lessons: (m.lessons ?? []).map(normalizeLesson),
  }));

/** Turn UI lesson back into a full Lesson for publishing */
const toServerLesson = (ui: UILesson, m: UIModule): Lesson => ({
  id: ui.id,
  title: ui.title,
  duration: ui.duration ?? 0,
  order: ui.order ?? 1,
  completed: ui.completed ?? false,
  completed_at: ui.completed_at ?? null,
  content: ui.content ?? "",
  course_id: ui.course_id ?? m.course_id,
  course_title: ui.course_title ?? "",
  module_id: ui.module_id ?? m.id,
  module_title: ui.module_title ?? m.title,
  created_at: ui.created_at ?? nowISO(),
  updated_at: nowISO(),
  video_url: ui.video_url ?? null,
  content_type: ui.content_type,
});

/** ---------- Component ---------- */
interface CourseCreateProgramProps {
  initialModules?: CourseModule[];
  onBack?: () => void;
  onPublish?: (modules: CourseModule[]) => void;
}

const CourseCreateProgram: React.FC<CourseCreateProgramProps> = ({
                                                                   initialModules,
                                                                   onBack,
                                                                   onPublish,
                                                                 }) => {
  const fallbackModules: CourseModule[] = [
    {
      id: uid(),
      title: "Модуль 1: Understanding UX basics",
      order: 1,
      course_id: 0,
      created_at: nowISO(),
      updated_at: nowISO(),
      lessons: [],
    },
  ];

  const [modules, setModules] = useState<UIModule[]>(
    toUI(initialModules && initialModules.length ? initialModules : fallbackModules)
  );

  // open/close state
  const [openModules, setOpenModules] = useState<Record<number, boolean>>(() => ({}));
  const [openLessons, setOpenLessons] = useState<Record<string, boolean>>(() => ({}));
  const isModuleOpen = (mid: number) => !!openModules[mid];
  const isLessonOpen = (mid: number, lid: number) => !!openLessons[`${mid}:${lid}`];

  const toggleModule = (mid: number) =>
    setOpenModules((prev) => ({ ...prev, [mid]: !prev[mid] }));

  const toggleLesson = (mid: number, lid: number) =>
    setOpenLessons((prev) => {
      const k = `${mid}:${lid}`;
      return { ...prev, [k]: !prev[k] };
    });

  const courseTotal = useMemo(
    () =>
      modules.reduce(
        (sum, m) => sum + m.lessons.reduce((s, l) => s + (l.duration || 0), 0),
        0
      ),
    [modules]
  );

  const updateModuleTitle = (mid: number, title: string) =>
    setModules((prev) =>
      prev.map((m) => (m.id === mid ? { ...m, title, updated_at: nowISO() } : m))
    );

  const addModule = () =>
    setModules((prev) => {
      const newOrder = prev.length + 1;
      const base: CourseModule = {
        id: uid(),
        title: `Модуль ${newOrder}: New module`,
        order: newOrder,
        course_id: 0,
        created_at: nowISO(),
        updated_at: nowISO(),
        lessons: [],
      };
      const [ui] = toUI([base]);
      setOpenModules((o) => ({ ...o, [ui.id]: true }));
      return [...prev, ui];
    });

  const removeModule = (mid: number) => {
    setModules((prev) => prev.filter((m) => m.id !== mid));
    setOpenModules((prev) => {
      const { [mid]: _omit, ...rest } = prev;
      return rest;
    });
    setOpenLessons((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(`${mid}:`)) delete next[k];
      });
      return next;
    });
  };

  const removeLesson = (mid: number, lid: number) =>
    setModules((prev) =>
      prev.map((m) =>
        m.id !== mid ? m : { ...m, lessons: m.lessons.filter((l) => l.id !== lid) }
      )
    );

  const updateLesson = (mid: number, lid: number, patch: Partial<UILesson>) =>
    setModules((prev) =>
      prev.map((m) =>
        m.id !== mid
          ? m
          : {
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === lid ? { ...l, ...patch, updated_at: nowISO() } : l
            ),
          }
      )
    );

  const addLesson = (mid: number) =>
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== mid) return m;
        const newOrder = (m.lessons?.length || 0) + 1;
        const newLesson: UILesson = {
          id: uid(),
          title: `Урок ${newOrder}: New lesson`,
          duration: 0,
          order: newOrder,
          content: "",
          video_url: null,
          content_type: "video",
          course_id: m.course_id,
          module_id: m.id,
          module_title: m.title,
        };
        setOpenLessons((o) => ({ ...o, [`${mid}:${newLesson.id}`]: true }));
        return { ...m, lessons: [...m.lessons, newLesson] };
      })
    );

  const publish = () => {
    // normalize UI -> API shape
    const clean: CourseModule[] = modules.map((m) => ({
      id: m.id,
      title: m.title,
      order: m.order,
      course_id: m.course_id,
      created_at: m.created_at,
      updated_at: nowISO(),
      lessons: m.lessons.map((l) => toServerLesson(l, m)), // Lesson[] (valid ModuleLesson[])
      lesson_count: m.lesson_count,
      assignment_count: m.assignment_count,
      total_duration: m.total_duration,
      duration_weeks: m.duration_weeks,
      statistics: m.statistics,
      summaryText: m.summaryText,
    }));
    onPublish?.(clean);
  };

  return (
    <div className="w-full h-full p-6 flex flex-col bg-white rounded-[20px] gap-6">
      <CourseCreateStages currentStage={2} />

      <div className="flex flex-col gap-6">
        {modules.map((m) => (
          <ModuleCard
            key={m.id}
            isOpen={isModuleOpen(m.id)}
            module={m}
            onToggle={() => toggleModule(m.id)}
            onTitleChange={(title) => updateModuleTitle(m.id, title)}
            onAddLesson={() => addLesson(m.id)}
            onToggleLesson={(lid) => toggleLesson(m.id, lid)}
            isLessonOpen={(lid) => isLessonOpen(m.id, lid)}
            onUpdateLesson={(lid, patch) => updateLesson(m.id, lid, patch)}
            onDeleteLesson={(lid) => removeLesson(m.id, lid)}
            onDeleteModule={() => removeModule(m.id)}
          />
        ))}

        <button
          type="button"
          onClick={addModule}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#E5E7EB] p-6 text-sm text-[#EE7A67] hover:bg-[#FFF7F6]"
        >
          <Icon
            icon="uil:plus"
            className="w-7 h-7 p-1 bg-[#FEF2F2] text-[#EE7A67] rounded-full"
          />
          Добавить новый модуль
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Назад
        </button>
        <button
          type="button"
          onClick={publish}
          className="rounded-xl bg-[#EE7A67] px-5 py-2 text-sm text-white hover:opacity-95"
        >
          Просмотр и публикация →
        </button>
      </div>
    </div>
  );
};

export default CourseCreateProgram;
