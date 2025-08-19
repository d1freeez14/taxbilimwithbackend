import {Icon} from "@iconify/react";
import CourseProgramModule from "@/components/CourseProgramModule";
import {Fragment} from "react";

interface Module {
  id: number;
  title: string;
  order: number;
  course_id: number;
  lessons: any[];
}

interface CourseProgramProps {
  modules?: Module[];
}

const CourseProgram = ({ modules = [] }: CourseProgramProps) => {
  return (
    <div className={'flex flex-col pt-8 gap-6 w-full h-full'}>
      <h2 className={'text-black text-[24px] font-semibold'}>Программа курса</h2>
      <div className={'flex items-center gap-4'}>
        <div className={'flex items-center gap-2'}>
          <Icon icon={'heroicons:document-text-20-solid'} className={'text-[#EE7A67] w-[16px] h-[16px]'}/>
          <p className={'text-[14px] text-black font-medium'}>{modules.length} Модулей</p>
        </div>
        <div className={'flex items-center gap-2'}>
          <Icon icon={'hugeicons:computer-video-call'} className={'text-[#EE7A67] w-[16px] h-[16px]'}/>
          <p className={'text-[14px] text-black font-medium'}>{modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} видеоуроков</p>
        </div>
        <div className={'flex items-center gap-2'}>
          <Icon icon={'mingcute:time-fill'} className={'text-[#EE7A67] w-[16px] h-[16px]'}/>
          <p className={'text-[14px] text-black font-medium'}>12 часов 30 минут</p>
        </div>
      </div>
      <div className={'bg-[#FAFAFA] p-6 flex flex-col gap-6 rounded-[1rem]'}>
        {modules.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No modules available</p>
        ) : (
          modules.map((module, index) => (
            <Fragment key={module.id}>
              <CourseProgramModule data={{
                title: module.title,
                lessons: module.lessons?.length || 0,
                tasks: 3,
                weeks: 2,
                bullets: [
                  'Lorem ipsum dolor sit amet consectetur. Convallis pulvinar mattis integer tincidunt integer bibendum integer in. Nisl eu dui facilisi sit tristique pretium in.',
                  'Sed magna in orci amet vulputate integer pharetra ipsum cum. Consectetur vivamus pellentesque aliquet nulla maecenas donec arcu eu ut.',
                ]
              }} />
              {index < modules.length - 1 && (
                <hr className="border-t border-[#EAECF0]" />
              )}
            </Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseProgram;