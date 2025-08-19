import Image from "next/image";
import {Icon} from "@iconify/react";
import Link from "next/link";

interface Course {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  price: string;
  author: {
    name: string;
    avatarSrc: string;
  };
  usersCount: number;
  likesCount: number;
  isCompleted?: boolean;
  enrolledAt?: string;
  is_recorded?: boolean;
  is_sales_leader?: boolean;
}

interface MyCourseCardProps {
  bg?: string;
  isFinished?: boolean;
  course?: Course;
}

const MyCourseCard = ({bg = 'white', isFinished = false, course}: MyCourseCardProps) => {

  return (
    <Link href={`/myEducation/${course?.id || 1}`} className={'flex flex-col p-5 rounded-[1rem] gap-6 items-center w-full'} style={{backgroundColor: bg}}>
      <div className="relative w-full aspect-video rounded-[0.5rem] overflow-hidden">
        <Image src={course?.imageSrc || "/coursePlaceholder.png"} alt="" fill className={"object-cover"}/>
        <div className={'absolute top-2.5 left-2.5'}>
          {(isFinished || course?.isCompleted) && (
            <div className={'bg-white rounded-[6px] py-1 px-2'}>
              <p className={'text-[12px] font-medium text-black'}>Завершено</p>
            </div>
          )}
        </div>
      </div>
      <div className={'flex flex-col gap-3 w-full'}>
        <h2 className={'text-black text-[20px] font-semibold'}>{course?.title || 'Названия курса связанного с налогами и прочее'}</h2>
        <div className={'flex items-center justify-between gap-4'}>
          {/*AUTHOR*/}
          <div className={'flex items-center gap-3'}>
            <Image src={course?.author?.avatarSrc || '/avatars.png'} alt={''} width={32} height={32} className={'rounded-full'}/>
            <p className={'text-[1rem] text-black font-medium'}>{course?.author?.name || 'Author Name'}</p>
          </div>
          {course?.is_recorded && (
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
          <div className={'flex items-center gap-1'}>
            <Icon icon={'solar:document-text-linear'} className={'text-[#676E76] w-[18px] h-[18px]'}/>
            <p className={'text-[#676E76] text-[14px] font-medium'}>Модулей:
              <span className={'ml-0.5 text-black font-semibold'}>3/5</span>
            </p>
          </div>
          <div className={'flex items-center gap-1'}>
            <Icon icon={'hugeicons:computer-video-call'} className={'text-[#676E76] w-[18px] h-[18px]'}/>
            <p className={'text-[#676E76] text-[14px] font-medium'}>Видео:
              <span className={'ml-0.5  text-black font-semibold'}>24/78</span>
            </p>
          </div>
          <div className={'flex items-center gap-1'}>
            <Icon icon={'fa-solid:tasks'} className={'text-[#676E76] w-[18px] h-[18px]'}/>
            <p className={'text-[#676E76] text-[14px] font-medium'}>Тестов:
              <span className={'ml-0.5 text-black font-semibold'}>10/24</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-400 h-full rounded-full"
              style={{width: "40%"}}
            ></div>
          </div>
          <span className="text-[12px] font-medium text-black">40%</span>
        </div>
        {isFinished && (
          <div className={'flex flex-col w-full gap-2'}>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: Implement certificate download
                alert('Certificate download will be implemented soon!');
              }}
              className={'px-5 py-3 bg-[#676E76] text-white rounded-[0.5rem] font-medium hover:bg-[#5a5a5a] transition-colors'}>
              Получить сертификат
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: Implement review functionality
                alert('Review functionality will be implemented soon!');
              }}
              className={'px-5 py-3 bg-white text-black rounded-[0.5rem] font-medium shadow-lg hover:bg-gray-50 transition-colors'}>
              Оставить отзыв
            </button>
          </div>
        )}
      </div>
    </Link>
  );
};
export default MyCourseCard;