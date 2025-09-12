'use client'
import {useState, useEffect, useMemo} from "react";
import MyCourseCard from "@/components/MyCourseCard";
import CertificateCard from "@/components/CertificateCard";
import {useSession} from "@/lib/useSession";
import {useQuery} from "@tanstack/react-query";
import {CourseService} from "@/services/course";

interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  enrolled_at: string;
  completed_at: string | null;
  course_title: string;
  course_image: string;
  course_price: string;
  author_name: string;
}

const MyEducation = () => {
  const {getSession} = useSession();
  const session = getSession();
  const [tabType, setTabType] = useState<'all' | 'current' | 'archive'>('all');

  // const {
  //   data: enrollments = [],
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["my-enrollments"],
  //   queryFn: async () => {
  //     // prefer session token if you have it; fallback to localStorage
  //     // const token = session?.token ?? localStorage.getItem("token");
  //     if (!token) return [];
  //     return CourseService.getMyEnrollments(token);
  //   },
  //   // If using session: enabled: !!session?.token,
  //   enabled: true,
  // });
  const {data: enrollments, isLoading, error} = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: () => CourseService.getMyEnrollments(session!.token),
    enabled: !!session?.token,
  });
  console.log(enrollments);
  const filteredEnrollments = useMemo(() => {
    switch (tabType) {
      case 'current':
        return enrollments?.filter(e => !e.completed_at);
      case 'archive':
        return enrollments?.filter(e => e.completed_at !== null);
      default:
        return enrollments;
    }
  }, [enrollments, tabType]);

  const allCount = enrollments?.length;
  const currentCount = enrollments?.filter(e => !e.completed_at).length;
  const archiveCount = enrollments?.filter(e => e.completed_at !== null).length;


  return (
    <div className={'flex flex-col items-start gap-8 px-10 py-5 w-full h-full'}>
      <div className={'flex border border-[#E5E7EA] rounded-[0.5rem] overflow-hidden text-[14px] font-semibold'}>
        <button
          onClick={() => setTabType('all')}
          className={`${tabType === 'all' ? 'bg-[#EE7A67] text-white' : 'bg-white text-[#676E76]'} px-[18px] py-[15px]`}>
          Все курсы ({allCount})
        </button>
        <button
          onClick={() => setTabType('current')}
          className={`${tabType === 'current' ? 'bg-[#EE7A67] text-white' : 'bg-white text-[#676E76]'} px-[18px] py-[15px] border-x border-[#E5E7EA]`}>
          Текущие ({currentCount})
        </button>
        <button
          onClick={() => setTabType('archive')}
          className={`${tabType === 'archive' ? 'bg-[#EE7A67] text-white' : 'bg-white text-[#676E76]'} px-[18px] py-[15px]`}>
          Архив ({archiveCount})
        </button>
      </div>

      {isLoading ? (
        <div className="w-full text-center py-10">
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      ) : filteredEnrollments?.length === 0 ? (
        <div className="w-full text-center py-10">
          <p className="text-gray-600">
            {tabType === 'all' ? 'You are not enrolled in any courses yet.' :
              tabType === 'current' ? 'No current courses.' :
                'No completed courses.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-3 lg:gap-6 w-full">
          {filteredEnrollments?.map((enrollment) => (
            <MyCourseCard
              key={enrollment.id}
              isFinished={enrollment.completed_at !== null}
              enrollment={enrollment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEducation;