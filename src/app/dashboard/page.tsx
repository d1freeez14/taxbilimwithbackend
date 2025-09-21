'use client'
import MainSlider from "@/components/MainSlider";
import {Icon} from "@iconify/react";
import CourseCard from "@/components/CourseCard";
import MyCourseCard from "@/components/MyCourseCard";
import courses from "@/static/courses.json"
import {useEffect, useState} from "react";
import {DashboardStats, User} from "@/types/user";
import {useSession} from "@/lib/useSession";

export default function Dashboard() {
  const {getSession} = useSession()
  const session = getSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    enrolledCourses: 0,
    completedCourses: 0,
    certificates: 0,
    totalProgress: 0
  });
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.token) {
        setLoading(false);
        return;
      }

      try {
        const enrollmentsResponse = await fetch(`${(typeof window !== 'undefined' ? (globalThis as any).process?.env?.NEXT_PUBLIC_API_URL : undefined) || 'http://89.219.32.91:5001'}/api/enrollments/my-enrollments`, {
          headers: {
            'Authorization': `Bearer ${session.token}`
          }
        });

        if (enrollmentsResponse.ok) {
          const enrollmentsData = await enrollmentsResponse.json();
          const enrollments = enrollmentsData.enrollments || [];
          const completedCourses = enrollments.filter((e: any) => e.completed_at !== null).length;

          setStats({
            enrolledCourses: enrollments.length,
            completedCourses,
            certificates: completedCourses,
            totalProgress: enrollments.length > 0 ? Math.round((completedCourses / enrollments.length) * 100) : 0
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [session?.token]);

  const welcomeMessage = session?.user ? `Добро пожаловать, ${session?.user.name}!` : 'Добро пожаловать в Tax Bilim!';
  const subtitle = session?.user ? 'Ваша панель управления готова к использованию.' : 'Пожалуйста, войдите в систему.';

  console.log("stats", stats);
  return (
    <div className={'flex justify-between items-start gap-5 px-10 w-full h-full'}>
      <div className={'flex flex-col gap-5 w-[60%] h-full'}>
        {/* Welcome Section */}
        <div className={'w-full flex flex-col gap-4 p-6 bg-white rounded-[20px]'}>
          <div className={'flex flex-col gap-2'}>
            <h1 className={'text-[24px] font-semibold text-black'}>{welcomeMessage}</h1>
            <p className={'text-[#676E76] text-[16px]'}>{subtitle}</p>
          </div>
          
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#EE7A67]"></div>
              <p className="text-gray-600">Загрузка статистики...</p>
            </div>
          ) : (
            <div className={'grid grid-cols-4 gap-4'}>
              <div className={'flex flex-col gap-2 p-4 bg-[#F6F7F9] rounded-[12px]'}>
                <p className={'text-[#676E76] text-[14px]'}>Записанных курсов</p>
                <p className={'text-[24px] font-semibold text-black'}>{stats.enrolledCourses}</p>
              </div>
              <div className={'flex flex-col gap-2 p-4 bg-[#F6F7F9] rounded-[12px]'}>
                <p className={'text-[#676E76] text-[14px]'}>Завершенных курсов</p>
                <p className={'text-[24px] font-semibold text-black'}>{stats.completedCourses}</p>
              </div>
              <div className={'flex flex-col gap-2 p-4 bg-[#F6F7F9] rounded-[12px]'}>
                <p className={'text-[#676E76] text-[14px]'}>Сертификатов</p>
                <p className={'text-[24px] font-semibold text-black'}>{stats.certificates}</p>
              </div>
              <div className={'flex flex-col gap-2 p-4 bg-[#F6F7F9] rounded-[12px]'}>
                <p className={'text-[#676E76] text-[14px]'}>Общий прогресс</p>
                <p className={'text-[24px] font-semibold text-black'}>{stats.totalProgress}%</p>
              </div>
            </div>
          )}
        </div>
        
        <MainSlider/>
        {/*Monthly courses*/}
        <div className={'w-full flex flex-col gap-6 p-6 bg-white rounded-[20px]'}>
          <div className={'flex items-center justify-between gap-2'}>
            <h2 className={'text-black text-[1.5rem] font-semibold'}>Топ курсы месяца</h2>
            <div className={'flex items-center gap-2'}>
              <button className={'bg-[#F6F7F9] text-black w-8 h-8 flex justify-center items-center rounded-[8px]'}>
                <Icon icon="material-symbols:chevron-left-rounded" className={'text-black w-6 h-6'}/>
              </button>
              <button className={'bg-[#F6F7F9] text-black w-8 h-8 flex justify-center items-center rounded-[8px]'}>
                <Icon icon="material-symbols:chevron-right-rounded" className={'text-black w-6 h-6'}/>
              </button>
            </div>
          </div>
          <div className={'flex gap-2 overflow-x-scroll'}>
            {/*<CourseCard bg={'#F6F7F9'} course={courses[0]}/>*/}
            {/*<CourseCard bg={'#F6F7F9'} course={courses[0]}/>*/}
          </div>
        </div>
        {/*Favourite courses*/}
        <div className={'w-full flex flex-col gap-6 p-6 bg-white rounded-[20px]'}>
          <div className={'flex items-center justify-between gap-2'}>
            <h2 className={'text-black text-[1.5rem] font-semibold'}>Избранные</h2>

            <button className={'bg-[#FAFAFA] text-black px-[18px] py-2.5 flex justify-center items-center gap-2 rounded-[8px]'}>
              <p className={'text-[14px] font-semibold'}>Показать все</p>
              <Icon icon="material-symbols:chevron-right-rounded" className={'text-black w-6 h-6'}/>
            </button>
          </div>
          <div className={'flex gap-2 overflow-x-scroll'}>
            {/*<CourseCard bg={'#F6F7F9'} course={courses[0]}/>*/}
            {/*<CourseCard bg={'#F6F7F9'} course={courses[0]}/>*/}
          </div>
        </div>
      </div>
      <div className={'w-[40%] p-6 bg-white rounded-[20px] gap-6 flex flex-col'}>
        <h1 className={'text-[24px] font-semibold text-black'}>Мое обучение</h1>
        <div className={'flex flex-col bg-[#F6F7F9] rounded-[16px]'}>
          <p className={'px-5 pt-5 text-[18px] font-semibold text-black'}>
            Текущий курс 1/12
          </p>
          {/*<MyCourseCard bg={'#F6F7F9'}/>*/}
        </div>
      </div>
    </div>
  )
}
