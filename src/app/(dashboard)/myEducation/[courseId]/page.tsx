'use client'
import {IconMain} from "@/shared/icons/IconMain";
import {Icon} from "@iconify/react";
import {IconCourses} from "@/shared/icons/IconCourses";
import Image from "next/image";
import MyCourseModule from "@/components/MyCourseModule";
import {Fragment, useEffect, useState} from "react";
import CourseProgramModule from "@/components/CourseProgramModule";
import {useParams} from "next/navigation";

interface Course {
  id: number;
  title: string;
  description: string;
  image_src: string;
  author_name: string;
  author_avatar: string;
  is_recorded: boolean;
  is_sales_leader: boolean;
  modules: any[];
}

const MyCourseById = () => {
  const { courseId } = useParams();
  const id = Array.isArray(courseId) ? courseId[0] : courseId;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5001/api/courses/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCourse(data.course);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-600">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-600">Course not found</p>
      </div>
    );
  }
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
            {course.title.length > 120 ? `${course.title.substring(0, 120)}...` : course.title}
          </p>
        </div>
      </div>
      <div className={'bg-white p-6 flex flex-col gap-4 rounded-[20px]'}>
        <h1 className={'text-[24px] text-black font-semibold'}>
          {course.title}
        </h1>
        <div className={'flex items-center gap-2 justify-between'}>
          <div className={'flex items-center gap-3'}>
            <Image src={course.author_avatar} alt={""} width={32} height={32} className={'rounded-full'}/>
            <p className={'text-[16px] text-black font-medium'}>{course.author_name}</p>
          </div>
          {course.is_recorded && (
            <div className={'flex items-center gap-1'}>
              <div className={'flex items-center gap-1 px-2 py-1 bg-[#F6F7F9] rounded-[1rem]'}>
                <Icon icon={'heroicons-solid:video-camera'} className={'text-black w-[18px] h-[18px]'}/>
                <p className={'text-black text-[12px]'}>В записи</p>
              </div>
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
              <span className={'ml-0.5 text-black font-semibold'}>{course.modules?.length || 0}</span>
            </p>
          </div>
          <div className={'flex items-center gap-1'}>
            <Icon icon={'hugeicons:computer-video-call'} className={'text-[#676E76] w-[18px] h-[18px]'}/>
            <p className={'text-[#676E76] text-[14px] font-medium'}>Видео:
              <span className={'ml-0.5  text-black font-semibold'}>{course.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0}</span>
            </p>
          </div>
          <div className={'flex items-center gap-1'}>
            <Icon icon={'fa-solid:tasks'} className={'text-[#676E76] w-[18px] h-[18px]'}/>
            <p className={'text-[#676E76] text-[14px] font-medium'}>Тестов:
              <span className={'ml-0.5 text-black font-semibold'}>0</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-400 h-full rounded-full"
              style={{width: "40%"}}
            ></div>
          </div>
          <span className="text-[12px] font-medium text-black">40%</span>
        </div>
      </div>
      <div className={'flex flex-col gap-6 bg-white rounded-[20px] p-6'}>
        {course.modules?.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No modules available</p>
        ) : (
          course.modules?.map((module, index) => (
            <Fragment key={module.id}>
              <MyCourseModule data={{
                title: module.title,
                lessons: module.lessons || []
              }} key={module.id}/>
              {index < course.modules.length - 1 && (
                <hr className="border-t border-[#EAECF0]"/>
              )}
            </Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default MyCourseById;