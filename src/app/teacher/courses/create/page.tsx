import {Icon} from "@iconify/react";
import CourseCreateInfo from "@/components/CourseCreateInfo";
import CourseCreateProgram from "@/components/CourseCreateProgram";

const TeacherCourseCreatePage = () => {
  return (
    <div className={'w-full h-full px-10'}>
      {/*<CourseCreateInfo/>*/}
      <CourseCreateProgram/>
    </div>
  );
};

export default TeacherCourseCreatePage;