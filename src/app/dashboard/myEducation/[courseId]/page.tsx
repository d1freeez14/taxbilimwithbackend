'use client'
import {IconMain} from "@/shared/icons/IconMain";
import {Icon} from "@iconify/react";
import {IconCourses} from "@/shared/icons/IconCourses";
import Image from "next/image";
import MyCourseModule from "@/components/MyCourseModule";
import {Fragment, useEffect} from "react";
import CourseProgramModule from "@/components/CourseProgramModule";
import modules from '@/static/modules.json'
import {useSession} from "@/lib/useSession";
import {useParams} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {CourseService} from "@/services/course";
import {ProgressService} from "@/services/progress";

const MyCourseById = () => {
  const {getSession} = useSession();
  const session = getSession();
  const {courseId} = useParams();
  const id = Array.isArray(courseId) ? courseId[0] : courseId

  const {data: course, isLoading, error} = useQuery({
    queryKey: ["course", id, session?.token],
    queryFn: () => CourseService.getCourseById(id, session!.token),
    enabled: !!id && !!session?.token,
  });
  console.log(course);
  // const {data: progress} = useQuery({
  //   queryKey: ["progress", id, session?.token],
  //   queryFn: () => ProgressService.getCourseProgressById(id, session!.token),
  //   enabled: !!id && !!session?.token,
  // });
  // console.log('progress',progress);

  return (
    <div className={'w-full h-full flex flex-col px-10 py-5 gap-5'}>
      <div className={'flex items-center gap-1'}>
        <div className={'flex items-center gap-2 text-[#9EA5AD]'}>
          <IconMain/>
          <p className={'text-[#9EA5AD] text-[14px] font-semibold'}>Главная</p>
        </div>
        <Icon icon={'material-symbols:chevron-right'} className={'text-[#9EA5AD] w-[18px] h-[18px]'}/>
        <div className={'flex items-center gap-2 text-[#9EA5AD]'}>
          <IconCourses/>
          <p className={'text-[#9EA5AD] text-[14px] font-semibold'}>Все курсы</p>
        </div>
        <Icon icon={'material-symbols:chevron-right'} className={'text-[#9EA5AD] w-[18px] h-[18px]'}/>
        <div className={'flex items-center gap-2 text-[#9EA5AD]'}>
          <Icon icon={'gridicons:menus'} className={'text-black w-[18px] h-[18px]'}/>
          <p className={'text-black text-[14px] font-semibold'}>
            {course?.title}
          </p>
        </div>
      </div>
      <div className={'bg-white p-6 flex flex-col gap-4 rounded-[20px]'}>
        <h1 className={'text-[24px] text-black font-semibold'}>
          {course?.title}
        </h1>
        <div className={'flex items-center gap-2 justify-between'}>
          <div className={'flex items-center gap-3'}>
            <Image src={course?.author_avatar ?? '/avatars.png'} alt={""} width={32} height={32}
                   className={'rounded-full'}/>
            <p className={'text-[16px] text-black font-medium'}>{course?.author_name}</p>
          </div>
          {course?.is_recorded && (
            <div className={'flex items-center gap-1'}>
              {course.is_recorded && (
                <div className={'flex items-center gap-1 px-2 py-1 bg-[#F6F7F9] rounded-[1rem]'}>
                  <Icon icon={'heroicons-solid:video-camera'} className={'text-black w-[18px] h-[18px]'}/>
                  <p className={'text-black text-[12px]'}>В записи</p>
                </div>
              )}
              <div className={'flex items-center gap-1 px-2 py-1 bg-[#F6F7F9] rounded-[1rem]'}>
                <div className={'text-black w-[18px] h-[18px] p-[3px]'}>
                  <div className={'bg-[#6AD09D] w-3 h-3 rounded-full'}>
                  </div>
                </div>
                <p className={'text-black text-[12px]'}>В записи</p>
              </div>
            </div>
          )}
        </div>
        <div className={'flex flex-wrap items-center gap-3'}>
          <div className={'flex items-center gap-1'}>
            <Icon icon={'solar:document-text-linear'} className={'text-[#676E76] w-[18px] h-[18px]'}/>
            <p className={'text-[#676E76] text-[14px] font-medium'}>Модулей:
              <span className={'ml-0.5 text-black font-semibold'}>{course?.statistics?.moduleCount}</span>
            </p>
          </div>
          <div className={'flex items-center gap-1'}>
            <Icon icon={'hugeicons:computer-video-call'} className={'text-[#676E76] w-[18px] h-[18px]'}/>
            <p className={'text-[#676E76] text-[14px] font-medium'}>Видео:
              <span className={'ml-0.5  text-black font-semibold'}>{course?.statistics?.lessonCount}</span>
            </p>
          </div>
          {/*<div className={'flex items-center gap-1'}>*/}
          {/*  <Icon icon={'fa-solid:tasks'} className={'text-[#676E76] w-[18px] h-[18px]'}/>*/}
          {/*  <p className={'text-[#676E76] text-[14px] font-medium'}>Тестов:*/}
          {/*    /!*<span className={'ml-0.5 text-black font-semibold'}>10/24</span>*!/*/}
          {/*  </p>*/}
          {/*</div>*/}
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-400 h-full rounded-full"
              style={{width: `${course?.progress}%`}}
            ></div>
          </div>
          <span className="text-[12px] font-medium text-black">{course?.progress}%</span>
        </div>
      </div>
      <div className={'flex flex-col gap-6 bg-white rounded-[20px] p-6'}>
        {course?.modules?.map((module, index) => (
          <Fragment key={index}>
            <MyCourseModule module={module} courseId={course?.id.toString()}/>
            {index < modules.data.length - 1 && (
              <hr className="border-t border-[#EAECF0]"/>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default MyCourseById;