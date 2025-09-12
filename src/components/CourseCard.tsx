'use client'
import Image from "next/image";
import {Icon} from "@iconify/react";
import {useState} from "react";
import Link from "next/link";
import {Course} from "@/types/course";

interface CourseCardProps {
  bg?: string;
  isFavourite?: boolean;
  isInCoursesPage?: boolean;
  course: Course;
  // onFavoriteToggle?: (courseId: number, isFavorite: boolean) => void;
}

const CourseCard = ({bg = 'white', isFavourite = false, isInCoursesPage = false, course,}: CourseCardProps) => {
  const [isFavorite, setIsFavorite] = useState(course.is_favorite || isFavourite);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add courses to favorites');
      return;
    }

    setIsLoading(true);
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`http://localhost:5001/api/favorites/${course.id}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        // onFavoriteToggle?.(course.id, !isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/dashboard/courses/${course.id}`} className={'flex flex-col p-5 rounded-[1rem] gap-6 items-center'} style={{backgroundColor: bg}}>
      <div className="relative w-full aspect-video rounded-[0.5rem] overflow-hidden">
        <Image
          src={course.image_src} alt="" fill className={"object-cover"}/>
        {course.is_sales_leader && (
          <div
            className={'flex bg-white items-center border border-[#F2C117] rounded-[0.5rem] absolute bottom-2.5 left-2.5 px-2.5 py-1.5'}>
            <Icon icon={'mdi:fire'} className={'text-[#EE7A67] w-[18px] h-[18px] rounded-[0.5rem]'}/>
            <p className={'text-[12px] text-black font-medium'}>Лидер продаж</p>
          </div>
        )}
        <div className={'absolute top-2.5 right-2.5'}>
          <button
            onClick={handleFavoriteToggle}
            disabled={isLoading}
            className="focus:outline-none"
          >
            {isFavorite ? (
              <Icon icon={'solar:star-bold'} className={'w-6 h-6 text-[#FFD16A]'}/>
            ) : (
              <Icon icon={'solar:star-line-duotone'} className={'w-6 h-6 text-white'}/>
            )}
          </button>
        </div>
      </div>
      <div className={'flex flex-col gap-3 w-[310px]'}>
        <h2 className={'text-black text-[20px] font-semibold'}>{course.title}</h2>
        <div className={'flex items-center justify-between gap-4'}>
          {/*AUTHOR*/}
          <div className={'flex items-center gap-3'}>
            <Image src={course.author_avatar || '/avatars.png'} alt={''} width={32} height={32} className={'rounded-full'}/>
            <p className={'text-[1rem] text-black font-medium'}>{course.author_name}</p>
          </div>

          {isInCoursesPage && course.is_recorded && (
            <div className={'flex items-center gap-1'}>
              <div className={'flex items-center gap-1 px-2 py-1 bg-[#F6F7F9] rounded-[1rem]'}>
                <Icon icon={'heroicons-solid:video-camera'} className={'text-black w-[18px] h-[18px]'}/>
                <p className={'text-black text-[12px]'}>В записи</p>
              </div>
              <div className={'flex items-center gap-1 px-2 py-1 bg-[#F6F7F9] rounded-[1rem]'}>
                <div className={'text-black w-[18px] h-[18px] p-[3px]'}>
                  <div className={'bg-[#6AD09D] w-3 h-3 rounded-full'}>
                  </div>
                </div>
                <p className={'text-black text-[12px]'}>В записи</p>
              </div>
            </div>
          )}
        </div>
        <div className={'flex items-center justify-between gap-3'}>
          <h2 className={'text-black text-[20px] font-semibold'}>{course.price}</h2>
          <div className={'flex items-center gap-1'}>
            <div className={'flex items-center gap-1'}>
              <Icon icon={'solar:user-outline'} className={'text-[#676E76] w-[18px] h-[18px]'}/>
              <p className={'text-[#676E76] text-[14px]'}>{course.enrollment_count}</p>
            </div>
            <div className={'flex items-center gap-1'}>
              <Icon icon={'iconamoon:like'} className={'text-[#676E76] w-[18px] h-[18px]'}/>
              <p className={'text-[#676E76] text-[14px]'}>({course.review_count})</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;