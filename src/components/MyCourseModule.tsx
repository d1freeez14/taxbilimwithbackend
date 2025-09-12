'use client'
import {Icon} from "@iconify/react";
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {CourseModule} from "@/types/course";

interface MyCourseModuleProps {
  module: CourseModule;
  courseId: string;
}

const MyCourseModule = ({module, courseId}: MyCourseModuleProps) => {
  const [open, setOpen] = useState(false)
  console.log(module)
  return (
    <div className="bg-transparent">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center"
      >
        <h3 className="text-[18px] font-semibold text-black">{module?.title}</h3>
        {open ? (
          <Icon icon={'icons8:minus'} className={'w-6 h-6 text-gray-500'}/>
        ) : (
          <Icon icon={'icons8:plus'} className={'w-6 h-6 text-gray-500'}/>)
        }
      </button>

      {open && (
        <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pt-5">
          {module?.lessons.map((lesson, i) => (
            <Link
              href={`${courseId}/module/${module.id}/lesson/${lesson.id}`}
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
                  {lesson.duration} минут
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

export default MyCourseModule;