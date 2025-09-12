'use client'
import {Icon} from "@iconify/react";
import Image from "next/image";
import lessons from '@/static/lessons.json'
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
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

  const {data: lesson} = useQuery({
    queryKey: ["lesson", lesson_id, session?.token],
    queryFn: () => CourseService.getLessonById(lesson_id, session!.token),
    enabled: !!lesson_id && !!session?.token,
  });
  console.log(lesson)
  return (
    <div className={'w-full h-full flex gap-8 items-start'}>
      <div className={'bg-white p-6 flex flex-col gap-8 rounded-[20px] w-full'}>
        {/*HEADER*/}
        <div className={'flex items-center justify-between gap-4'}>
          <div className={'flex items-center gap-4'}>
            <Icon onClick={() => router.push(`/dashboard/myEducation/${course_id}`)}
                  icon={'material-symbols-light:chevron-left'} className={'w-8 h-8 p-0 text-[#676E76] cursor-pointer'}/>
            <h1 className={'text-black text-[30px] font-semibold'}>{lesson?.title}</h1>
          </div>
          <div className={'flex items-center gap-3'}>
            <button
              className={'flex items-center justify-center p-2 border border-[#676E76] border-opacity-20 rounded-full'}>
              <Icon icon={'material-symbols-light:chevron-left'} className={'w-6 h-6 text-[#676E76]'}/>
            </button>
            <button
              className={'flex items-center justify-center p-2 border border-[#676E76] border-opacity-20 rounded-full'}>
              <Icon icon={'material-symbols-light:chevron-right'} className={'w-6 h-6 text-[#676E76]'}/>
            </button>
          </div>
        </div>
        {/*VIDEO*/}
        <div className={'relative w-full aspect-video '}>
          <Image src={'/courseVideo.png'} alt={''} fill objectFit={'cover'}/>
        </div>
        {/*DESCRIPTION*/}
        <div className={'flex flex-col gap-6'}>
          <h2 className={'text-black text-[24px] font-semibold'}>Описание</h2>
          <p className={'text-[#383F45] text-[14px]'}>
            {lesson?.content}
          </p>
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
    </div>
  );
};

export default LessonPageById;