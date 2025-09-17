"use client";

import React from "react";
import { Icon } from "@iconify/react";
import CourseCreateStages from "@/components/CourseCreateStages";

/** UI-only placeholders — replace with real data later */
const MOCK = {
  title: "Fundamentals of UX Design",
  description:
    "Egestas vitae sit fusce pretium dignissim eu eget est sodales. Volutpat vestibulum augue diam elementum sit in sit. Massa aliquet dui aenean sem eu et erat. Sed egestas gravida arcu potenti rhoncus sed ipsum bibendum. Nibh aliquet et lacus sem felis dapibus varius risus a. At donec massa leo morbi. Natoque pharetra quisque enim dictumst cras hendrerit sed. Maecenas.",
  accessLabel: "Пожизненно",
  priceUsd: 99,
  category: "Налоги",
  coverUrl: "",
  card: {
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
    title: "Название курса связанного с налогами и прочее",
    author: "Лана Б.",
    priceKzt: "25 990 ₸",
    badges: ["В записи", "Онлайн"],
    stats: { students: 8, comments: 0, likes: 0 },
  },
};

const CourseCreatePublishComponent: React.FC = () => {
  return (
    <div className="w-full h-full p-6 flex flex-col bg-white rounded-[20px] gap-6">
      <CourseCreateStages currentStage={2} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: summary */}
        <div className="lg:col-span-2">
          <dl className="grid grid-cols-[160px,1fr] gap-y-5 items-start">
            <dt className="text-sm text-gray-500">Название</dt>
            <dd className="text-base font-semibold">{MOCK.title}</dd>

            <dt className="text-sm text-gray-500">Описание</dt>
            <dd className="text-sm leading-6 text-gray-700 whitespace-pre-line">
              {MOCK.description}
            </dd>

            <dt className="text-sm text-gray-500">Доступ у студента</dt>
            <dd className="text-base font-semibold">{MOCK.accessLabel}</dd>

            <dt className="text-sm text-gray-500">Цена</dt>
            <dd className="text-base font-semibold">${MOCK.priceUsd}</dd>

            <dt className="text-sm text-gray-500">Категория</dt>
            <dd className="text-base font-semibold">{MOCK.category}</dd>
          </dl>

          {/* Cover / video preview */}
          <div className="mt-6">
            <div className="relative aspect-video w-[80%] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              {MOCK.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={MOCK.coverUrl}
                  alt="course cover"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
              <div className="absolute inset-0 grid place-items-center">
                <button
                  type="button"
                  className="grid place-items-center h-16 w-16 rounded-full bg-white/90 shadow"
                  title="Просмотр превью"
                >
                  <Icon icon="lucide:play" className="h-7 w-7 text-[#EE7A67]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: preview card */}
        <div className="lg:col-span-1">
          <p className="mb-3 text-sm text-gray-500">Превью карточки</p>
          <CoursePreviewCard
            image={MOCK.card.image}
            title={MOCK.card.title}
            author={MOCK.card.author}
            price={MOCK.card.priceKzt}
            badges={MOCK.card.badges}
            stats={MOCK.card.stats}
          />
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Назад
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Сохранить как черновик
          </button>
          <button
            type="button"
            className="rounded-xl bg-[#EE7A67] px-5 py-2 text-sm text-white hover:opacity-95"
          >
            Опубликовать →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCreatePublishComponent;

/* ---------------- Preview Card ---------------- */

type Stats = { students: number; comments: number; likes: number };
interface CardProps {
  image?: string;
  title: string;
  author: string;
  price: string;
  badges?: string[];
  stats: Stats;
}

const CoursePreviewCard: React.FC<CardProps> = ({
                                                  image,
                                                  title,
                                                  author,
                                                  price,
                                                  badges = [],
                                                  stats,
                                                }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="relative h-36 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image ? (
          <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gray-100" />
        )}

        {badges.length > 0 && (
          <div className="absolute top-2 right-2 flex gap-2">
            {badges.map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-gray-800 shadow"
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-[15px] font-semibold leading-5 line-clamp-2">{title}</h3>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <div className="grid place-items-center h-6 w-6 overflow-hidden rounded-full bg-gray-300">
            <Icon icon="lucide:user" className="h-4 w-4 text-gray-600" />
          </div>
          <span className="truncate">{author}</span>
        </div>

        <div className="mt-3 text-[15px] font-semibold">{price}</div>

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Icon icon="lucide:users" className="h-4 w-4" />
            {String(stats.students)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon icon="lucide:message-circle" className="h-4 w-4" />
            {String(stats.comments)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon icon="lucide:thumbs-up" className="h-4 w-4" />
            {String(stats.likes)}
          </span>
        </div>
      </div>
    </div>
  );
};
