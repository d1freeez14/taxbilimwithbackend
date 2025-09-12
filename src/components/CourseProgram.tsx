import {Icon} from "@iconify/react";
import CourseProgramModule from "@/components/CourseProgramModule";
import {Fragment} from "react";
import {CourseModule} from "@/types/course";

interface CourseProgramProps {
  modules: CourseModule[];
}

const pluralizeModules = (count: number) => {
  const absCount = Math.abs(count) % 100;
  const lastDigit = absCount % 10;

  if (absCount > 10 && absCount < 20) {
    return `${count} Модулей`;
  }
  if (lastDigit === 1) {
    return `${count} Модуль`;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} Модуля`;
  }
  return `${count} Модулей`;
}

const CourseProgram = ({modules}: CourseProgramProps) => {
  return (
    <div className={'flex flex-col pt-8 gap-6 w-full h-full'}>
      <h2 className={'text-black text-[24px] font-semibold'}>Программа курса</h2>
      <div className={'flex items-center gap-4'}>
        <div className={'flex items-center gap-2'}>
          <Icon icon={'heroicons:document-text-20-solid'} className={'text-[#EE7A67] w-[16px] h-[16px]'}/>
          <p className={'text-[14px] text-black font-medium'}>{pluralizeModules(modules.length)}</p>
        </div>
        {/* Todo: add new fields to duration of course and full course lesson length */}

        {/*<div className={'flex items-center gap-2'}>*/}
        {/*  <Icon icon={'hugeicons:computer-video-call'} className={'text-[#EE7A67] w-[16px] h-[16px]'}/>*/}
        {/*  <p className={'text-[14px] text-black font-medium'}>78 видеоуроков</p>*/}
        {/*</div>*/}
        {/*<div className={'flex items-center gap-2'}>*/}
        {/*  <Icon icon={'mingcute:time-fill'} className={'text-[#EE7A67] w-[16px] h-[16px]'}/>*/}
        {/*  <p className={'text-[14px] text-black font-medium'}>12 часов 30 минут</p>*/}
        {/*</div>*/}
      </div>
      <div className={'bg-[#FAFAFA] p-6 flex flex-col gap-6 rounded-[1rem]'}>
        {modules.map((module, index) => (
          <Fragment key={index}>
            <CourseProgramModule data={module}/>
            {index < modules.length - 1 && (
              <hr className="border-t border-[#EAECF0]"/>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default CourseProgram;