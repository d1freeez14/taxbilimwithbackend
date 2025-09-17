import {Icon} from "@iconify/react";
import CourseProgramModule from "@/components/CourseProgramModule";
import {Fragment} from "react";
import {Course, CourseModule} from "@/types/course";

interface CourseProgramProps {
  course: Course;
}

const pluralizeRu = (count: number, [one, few, many]: [string, string, string]) => {
  const n = Math.abs(count) % 100;
  const d = n % 10;
  const word =
    n > 10 && n < 20 ? many :
      d === 1 ? one :
        d >= 2 && d <= 4 ? few : many;

  return `${count} ${word}`;
};

const pluralizeModules   = (c: number) => pluralizeRu(c, ["Модуль", "Модуля", "Модулей"]);
const pluralizeLessons   = (c: number) => pluralizeRu(c, ["видеоурок", "видеоурока", "видеоуроков"]);

const CourseProgram = ({course}: CourseProgramProps) => {
  const modules = course.modules ?? []
  const moduleCount = course.statistics?.moduleCount ?? modules.length ?? 0;
  const lessonCount = course.statistics?.lessonCount ?? 0;

  return (
    <div className={'flex flex-col pt-8 gap-6 w-full h-full'}>
      <h2 className={'text-black text-[24px] font-semibold'}>Программа курса</h2>
      <div className={'flex items-center gap-4'}>
        <div className={'flex items-center gap-2'}>
          <Icon icon={'heroicons:document-text-20-solid'} className={'text-[#EE7A67] w-[16px] h-[16px]'}/>
          <p className={'text-[14px] text-black font-medium'}>{pluralizeModules(moduleCount)}</p>
        </div>
        <div className={'flex items-center gap-2'}>
          <Icon icon={'hugeicons:computer-video-call'} className={'text-[#EE7A67] w-[16px] h-[16px]'}/>
          <p className={'text-[14px] text-black font-medium'}>{pluralizeLessons(lessonCount)}</p>
        </div>
        <div className={'flex items-center gap-2'}>
          <Icon icon={'mingcute:time-fill'} className={'text-[#EE7A67] w-[16px] h-[16px]'}/>
          <p className={'text-[14px] text-black font-medium'}>{course.statistics?.formattedDuration}</p>
        </div>
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