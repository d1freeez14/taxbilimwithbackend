'use client'
import {MyCourseModuleProps} from "@/components/MyCourseModule";
import {Fragment, useState} from "react";
import {Icon} from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import ChatComponent from "@/components/Chat";
import modules from '@/static/modules.json'

const ModuleLayout = ({
                        children
                      }: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true)

  return (
    <div className={'w-full h-full flex gap-8 px-10 py-5 items-start'}>
      <div className={'w-[70%]'}>
        {children}
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
              {
                modules.data.map((module, index) => (
                  <Fragment key={index}>
                    <MyCourseModuleSidebar data={module} key={index}/>
                    {index < modules.data.length - 1 && (
                      <hr className="border-t border-[#EAECF0]"/>
                    )}
                  </Fragment>
                ))
              }
            </>
          )}
        </div>
        <ChatComponent/>
      </div>
    </div>
  )
    ;
}

const MyCourseModuleSidebar = ({data}: MyCourseModuleProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-transparent">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-start gap-2"
      >
        <h3 className="text-[16px] font-semibold text-black text-left">{data.title}</h3>
        {open ? (
          <Icon icon={'icons8:minus'} className={'w-6 h-6 text-gray-500'}/>
        ) : (
          <Icon icon={'icons8:plus'} className={'w-6 h-6 text-gray-500'}/>)
        }
      </button>

      {open && (
        <div className="grid grid-cols-2 gap-6 pt-5">
          {data.lessons.map((lesson, i) => (
            <Link
              href={'/src/app/(dashboard)/myEducation/%5BcourseId%5D/module/%5BmoduleId%5D/lesson/1'}
              key={i}
              className="relative bg-white rounded-lg overflow-hidden"
            >
              {/* thumbnail */}
              <div className="relative w-full aspect-video z-0">
                <Image
                  src={lesson.imageSrc}
                  alt={lesson.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 z-20">
                  {lesson.locked ? (
                    <Icon
                      icon="material-symbols:lock"
                      className="w-8 h-8 text-white bg-black rounded-full p-2"
                    />
                  ) : lesson.completed ? (
                    <Icon
                      icon="mdi:tick"
                      className="w-8 h-8 text-white bg-[#53B483] rounded-full p-2"
                    />
                  ) : null}
                </div>

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