'use client'
import {Icon} from "@iconify/react";
import {useState} from "react";
import {CourseModule} from "@/types/course";


interface CourseProgramModuleProps {
  data: CourseModule;
}

const CourseProgramModule = ({data}: CourseProgramModuleProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-transparent">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center"
      >
        <h3 className="text-xl font-semibold text-gray-900">{data.title}</h3>
        {open ? (
          <Icon icon={'icons8:minus'} className={'w-6 h-6 text-gray-500'}/>
        ) : (
          <Icon icon={'icons8:plus'} className={'w-6 h-6 text-gray-500'}/>)
        }
      </button>

      <p className="mt-2 text-sm text-gray-500">
        {data.summaryText}
      </p>

      {open && (
        <ul className="mt-4 list-disc list-inside space-y-2 text-gray-700">
          {data.lessons.map((lesson) => (
            <li key={lesson.id}>{lesson.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseProgramModule;