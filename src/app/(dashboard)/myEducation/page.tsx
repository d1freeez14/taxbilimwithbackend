'use client'
import {useState, useEffect} from "react";
import MyCourseCard from "@/components/MyCourseCard";
import CertificateCard from "@/components/CertificateCard";

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
  const [tabType, setTabType] = useState<'all' | 'current' | 'archive'>('all');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5001/api/enrollments/my-enrollments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setEnrollments(data.enrollments || []);
        }
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const filteredEnrollments = enrollments.filter(enrollment => {
    switch (tabType) {
      case 'current':
        return !enrollment.completed_at;
      case 'archive':
        return enrollment.completed_at !== null;
      default:
        return true;
    }
  });

  const allCount = enrollments.length;
  const currentCount = enrollments.filter(e => !e.completed_at).length;
  const archiveCount = enrollments.filter(e => e.completed_at !== null).length;

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
      
      {loading ? (
        <div className="w-full text-center py-10">
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="w-full text-center py-10">
          <p className="text-gray-600">
            {tabType === 'all' ? 'You are not enrolled in any courses yet.' :
             tabType === 'current' ? 'No current courses.' :
             'No completed courses.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-3 lg:gap-6 w-full">
          {filteredEnrollments.map((enrollment) => (
            <MyCourseCard 
              key={enrollment.id}
              isFinished={enrollment.completed_at !== null}
              course={{
                id: enrollment.course_id,
                title: enrollment.course_title,
                description: "Course description", // Default value since not provided by API
                imageSrc: enrollment.course_image,
                price: `${parseFloat(enrollment.course_price).toLocaleString()} ₸`,
                author: {
                  name: enrollment.author_name,
                  avatarSrc: "/avatars.png" // Default avatar
                },
                usersCount: 0, // Default value since not provided by API
                likesCount: 0, // Default value since not provided by API
                isCompleted: enrollment.completed_at !== null,
                enrolledAt: enrollment.enrolled_at
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEducation;