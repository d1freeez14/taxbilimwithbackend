'use client'
import {Icon} from "@iconify/react";
import Image from "next/image";
import lessons from '@/static/lessons.json'
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useMutation, useQuery} from "@tanstack/react-query";
import {CourseService} from "@/services/course";
import {useSession} from "@/lib/useSession";

const LessonPageById = () => {
  const {getSession} = useSession();
  const session = getSession();
  const router = useRouter();
  const {courseId, moduleId, lessonId} = useParams();
  console.log({courseId, moduleId, lessonId})
  const course_id = Array.isArray(courseId) ? courseId[0] : courseId ?? "";
  const module_id = Array.isArray(moduleId) ? moduleId[0] : moduleId ?? "";
  const lesson_id = Array.isArray(lessonId) ? lessonId[0] : lessonId ?? "";

  const {data: lesson, refetch} = useQuery({
    queryKey: ["lesson", lesson_id, session?.token],
    queryFn: () => CourseService.getLessonById(lesson_id, session!.token),
    enabled: !!lesson_id && !!session?.token,
  });
  console.log(lesson)

  const { mutate: toggleFinished, isPending } = useMutation({
    mutationFn: async () => {
      if (!session?.token) throw new Error("No token");
      return lesson?.is_finished
        ? CourseService.markLessonIncomplete(lesson_id, session.token)
        : CourseService.markLessonComplete(lesson_id, session.token);
    },
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className={'w-full h-full flex flex-col gap-8'}>
      {/*VIDEO*/}
      <div className={'relative w-full aspect-video '}>
        <Image src={'/courseVideo.png'} alt={''} fill objectFit={'cover'}/>
      </div>
      {/*DESCRIPTION*/}
      {/* DESCRIPTION + BUTTON */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <h2 className={'text-black text-[24px] font-semibold'}>Описание</h2>
          <p className={'text-[#383F45] text-[14px]'}>{lesson?.content}</p>
        </div>

        {lesson && (
          <div className="shrink-0">
            <button
              onClick={() => toggleFinished()}
              disabled={isPending}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-[10px] border text-[14px] font-semibold disabled:opacity-60
                ${lesson.is_finished
                ? "border-[#EAECF0] text-[#1A1D1F] bg-white"
                : "border-[#EE7A67] text-white bg-[#EE7A67]"}`}
              title={lesson.is_finished ? "Снять отметку «Завершено»" : "Отметить как завершённый"}
            >
              {isPending ? "Сохранение…" : (lesson.is_finished ? "Снять «Завершено»" : "Отметить как завершённый")}
            </button>
          </div>
        )}
      </div>
      <hr className={'border-t border-[#E5E7EA]'}/>
      {/*MATERIALS*/}
      <div className={'flex flex-col gap-6'}>
        <h2 className={'text-black text-[24px] font-semibold'}>Материалы</h2>
        {/*<div className={'flex flex-col gap-2'}>*/}
        {/*  <div className={'flex items-center justify-between gap-4 p-3 bg-[#FAFAFA] rounded-[16px]'}>*/}
        {/*    <div className={'flex items-center gap-3'}>*/}
        {/*      <Icon icon={'basil:document-solid'}*/}
        {/*            className={'w-10 h-10 p-1.5 bg-[#FEF2F2] text-[#EE7A67] rounded-[8px]'}/>*/}
        {/*      <p className={'text-black text-[16px] font-medium'}>Налоговые консультации.pdf</p>*/}
        {/*    </div>*/}
        {/*    <button*/}
        {/*      className={'flex items-center gap-2 px-5 py-3 bg-[#EE7A67] text-white text-[14px] font-semibold rounded-[8px]'}>*/}
        {/*      Скачать*/}
        {/*      <Icon icon={'hugeicons:download-01'} className={'w-[18px] h-[18px]'}/>*/}
        {/*    </button>*/}
        {/*  </div>*/}
        {/*  <div className={'flex items-center justify-between gap-4 p-3 bg-[#FAFAFA] rounded-[16px]'}>*/}
        {/*    <div className={'flex items-center gap-3'}>*/}
        {/*      <Icon icon={'basil:document-solid'}*/}
        {/*            className={'w-10 h-10 p-1.5 bg-[#FEF2F2] text-[#EE7A67] rounded-[8px]'}/>*/}
        {/*      <p className={'text-black text-[16px] font-medium'}>Налоговые консультации.pdf</p>*/}
        {/*    </div>*/}
        {/*    <button*/}
        {/*      className={'flex items-center gap-2 px-5 py-3 bg-[#EE7A67] text-white text-[14px] font-semibold rounded-[8px]'}>*/}
        {/*      Скачать*/}
        {/*      <Icon icon={'hugeicons:download-01'} className={'w-[18px] h-[18px]'}/>*/}
        {/*    </button>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default LessonPageById;