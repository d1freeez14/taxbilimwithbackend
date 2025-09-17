'use client'
import {Fragment, useMemo, useState} from "react";
import {Icon} from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import ChatComponent from "@/components/Chat";
import {useQuery} from "@tanstack/react-query";
import {CourseService} from "@/services/course";
import {useParams, useRouter} from "next/navigation";
import {useSession} from "@/lib/useSession";
import {CourseModule} from "@/types/course";
import {TestService} from "@/services/test";

const ModuleLayout = ({children}: { children: React.ReactNode }) => {
  const {getSession} = useSession();
  const session = getSession();
  const [open, setOpen] = useState(true)
  const {courseId, moduleId, lessonId, testId} = useParams();
  const course_id = Array.isArray(courseId) ? courseId[0] : courseId ?? "";
  const module_id = Array.isArray(moduleId) ? moduleId[0] : moduleId ?? "";
  const lesson_id = Array.isArray(lessonId) ? lessonId[0] : lessonId ?? "";
  const test_id = Array.isArray(testId) ? testId[0] : testId ?? "";

  const router = useRouter();
  const {data: course, isLoading, error} = useQuery({
    queryKey: ["course", courseId, session?.token],
    queryFn: () => CourseService.getCourseById(course_id, session!.token),
    enabled: !!courseId && !!session?.token,
  });

  const {data: lesson} = useQuery({
    queryKey: ["lesson_header", lesson_id, session?.token],
    queryFn: () => CourseService.getLessonById(lesson_id, session!.token),
    enabled: !!lesson_id && !!session?.token,
  });

  const {data: testData} = useQuery({
    queryKey: ["test_header", test_id, session?.token],
    queryFn: () => TestService.getTestById(test_id, session!.token!), // используем getTestById
    enabled: !!test_id && !!session?.token,
  });

  const headerTitle = lesson?.title ?? testData?.test?.title ?? "";

  const modules = course?.modules ?? [];

  const currentModule = useMemo(
    () => modules.find((m) => String(m.id) === String(module_id)),
    [modules, module_id]
  );
  const moduleLessons = currentModule?.lessons ?? [];

  const currentLessonItem = useMemo(() => {
    if (lesson_id) {
      return moduleLessons.find((l: any) => String(l.id) === String(lesson_id));
    }
    if (test_id) {
      return moduleLessons.find((l: any) => l.lesson_type === "TEST" && String(l.test_id) === String(test_id));
    }
    return undefined;
  }, [moduleLessons, lesson_id, test_id]);

  const currentIdx = useMemo(() => {
    if (!currentLessonItem) return -1;
    return moduleLessons.findIndex((l: any) =>
      String(l.id) === String(currentLessonItem.id)
    );
  }, [moduleLessons, currentLessonItem]);

  function pushToLessonOrTest(item: any) {
    if (item.lesson_type === "TEST" && item.test_id) {
      router.push(`/dashboard/myEducation/${course_id}/module/${module_id}/test/${item.test_id}`);
    } else {
      router.push(`/dashboard/myEducation/${course_id}/module/${module_id}/lesson/${item.id}`);
    }
  }

  function goPrev() {
    if (currentIdx > 0) {
      pushToLessonOrTest(moduleLessons[currentIdx - 1]);
    }
  }
  function goNext() {
    if (currentIdx === -1) return;
    if (currentIdx < moduleLessons.length - 1) {
      pushToLessonOrTest(moduleLessons[currentIdx + 1]);
    } else {
      router.push(`/dashboard/myEducation/${course_id}`);
    }
  }

  const navDisabled = currentIdx === -1;

  return (
    <div className={'w-full h-full flex gap-8 px-10 py-5 items-start'}>
      <div className={'w-[70%]'}>
        <div className={'bg-white p-6 flex flex-col gap-8 rounded-[20px] w-full'}>
          {/*HEADER*/}
          <div className={'flex items-center justify-between gap-4'}>
            <div className={'flex items-center gap-4'}>
              <Icon onClick={() => router.push(`/dashboard/myEducation/${course_id}`)}
                    icon={'material-symbols-light:chevron-left'}
                    className={'w-8 h-8 p-0 text-[#676E76] cursor-pointer'}/>
              <h1 className={'text-black text-[30px] font-semibold truncate'}>{headerTitle}</h1>
            </div>
            <div className={'flex items-center gap-3'}>
              <button
                onClick={goPrev}
                disabled={navDisabled || currentIdx <= 0}
                className={'flex items-center justify-center p-2 border border-[#676E76] border-opacity-20 rounded-full disabled:opacity-50'}
              >
                <Icon icon={'material-symbols-light:chevron-left'} className={'w-6 h-6 text-[#676E76]'}/>
              </button>
              <button
                onClick={goNext}
                // disabled={navDisabled || currentIdx >= moduleLessons.length - 1}
                className={'flex items-center justify-center p-2 border border-[#676E76] border-opacity-20 rounded-full disabled:opacity-50'}
              >
                <Icon icon={'material-symbols-light:chevron-right'} className={'w-6 h-6 text-[#676E76]'}/>
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>
      <div className={'w-[30%] flex flex-col gap-4'}>
        <div className={'flex flex-col gap-6 bg-white rounded-[20px] p-6'}>
          <div className={'flex items-center justify-between gap-4'}>
            <h2 className={'text-[24px] font-semibold text-black'}>Содержание</h2>
            <button onClick={() => setOpen(!open)}
                    className={'text-[#676E76] p-2 border border-[#676E76] border-opacity-20 rounded-full'}>
              {open ? (
                <Icon icon={'mdi-light:chevron-down'} className={'w-6 h-6'}/>
              ) : (
                <Icon icon={'mdi-light:chevron-up'} className={'w-6 h-6'}/>
              )}
            </button>
          </div>
          {open && (
            <>
              <hr/>
              {modules.map((module, index) => (
                <Fragment key={index}>
                  <MyCourseModuleSidebar key={index} data={module} course_id={course_id} module_id={module_id}
                                         lesson_id={lesson_id}/>
                  {index < modules.length - 1 && (
                    <hr className="border-t border-[#EAECF0]"/>
                  )}
                </Fragment>
              ))}
            </>
          )}
        </div>
        <ChatComponent/>
      </div>
    </div>
  )
    ;
}

interface MyCourseModuleSidebarProps {
  data: CourseModule;
  course_id: string;
  module_id: string;
  lesson_id: string;
}

const MyCourseModuleSidebar = ({data, course_id, module_id, lesson_id}: MyCourseModuleSidebarProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-transparent">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-start gap-2"
      >
        <h3 className="text-[16px] font-semibold text-black text-left">{data.title}</h3>
        {open ? (
          <Icon icon={'icons8:minus'} className={'w-6 h-6 text-gray-500 shrink-0'}/>
        ) : (
          <Icon icon={'icons8:plus'} className={'w-6 h-6 text-gray-500 shrink-0'}/>)
        }
      </button>

      {open && (
        <div className="grid grid-cols-2 gap-6 pt-5">
          {data.lessons.map((lesson, i) => (
            <Link
              href={
                lesson.lesson_type === "TEST"
                  ? `/dashboard/myEducation/${course_id}/module/${module_id}/test/${lesson.test_id}`
                  : `/dashboard/myEducation/${course_id}/module/${module_id}/lesson/${lesson.id}`
              }
              key={i}
              className="relative bg-white rounded-lg overflow-hidden"
            >
              {/* thumbnail */}
              <div className="relative w-full aspect-video z-0">
                <Image
                  src={"/coursePlaceholder.png"}
                  alt={lesson.title}
                  fill
                  className="object-cover"
                />
                {/*<div className="absolute top-2 left-2 z-20">*/}
                {/*  {lesson.locked ? (*/}
                {/*    <Icon*/}
                {/*      icon="material-symbols:lock"*/}
                {/*      className="w-8 h-8 text-white bg-black rounded-full p-2"*/}
                {/*    />*/}
                {/*  ) : lesson.completed ? (*/}
                {/*    <Icon*/}
                {/*      icon="mdi:tick"*/}
                {/*      className="w-8 h-8 text-white bg-[#53B483] rounded-full p-2"*/}
                {/*    />*/}
                {/*  ) : null}*/}
                {/*</div>*/}

                <div
                  className="absolute bottom-2 left-2 z-20 bg-white bg-opacity-75 px-2 py-1 rounded text-xs font-medium text-gray-800">
                  {lesson.duration}
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm font-semibold text-gray-900">
                  {`${i + 1}. ${lesson.title}`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};


export default ModuleLayout;