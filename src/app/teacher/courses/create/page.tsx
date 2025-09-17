import {Icon} from "@iconify/react";
import CourseCreateInfo from "@/components/CourseCreateInfo";
import CourseCreateProgram from "@/components/CourseCreateProgram";
import CourseCreatePublishComponent from "@/components/CourseCreatePublishComponent";

const TeacherCourseCreatePage = () => {
  return (
    <div className={'w-full h-full px-10'}>
      {/*<CourseCreateInfo/>*/}
      {/*<CourseCreateProgram/>*/}
      <CourseCreatePublishComponent/>
    </div>
  );
};

export default TeacherCourseCreatePage;