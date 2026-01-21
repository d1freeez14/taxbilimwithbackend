import Image from "next/image";
import {Icon} from "@iconify/react";
import Link from "next/link";
import {Enrollment} from "@/types/course";
import {useRouter} from "next/navigation";
import ReviewModal from "@/components/ReviewModal";
import {useState} from "react";
import {useSession} from "@/lib/useSession";
import {useQuery} from "@tanstack/react-query";
import {ReviewsService} from "@/services/reviews";

interface MyCourseCardProps {
  bg?: string;
  isFinished?: boolean;
  enrollment: Enrollment;
}

const MyCourseCard = ({bg = 'white', isFinished = false, enrollment}: MyCourseCardProps) => {
  const router = useRouter();
  const {session} = useSession();

  const getCertificate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/dashboard/myCertificates');
  };
  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  const {data: canReviewData, isLoading: canReviewLoading} = useQuery({
    queryKey: ['can-review', enrollment.course_id],
    queryFn: async () => {
      if (!session?.token) throw new Error('No token');
      return ReviewsService.canReview(enrollment.course_id, session.token);
    },
    enabled: Boolean(
      session?.token &&
      isFinished &&
      enrollment?.completed_at
    ),
    staleTime: 60_000,
  });

  return (
    <div
      className="flex flex-col p-5 rounded-[1rem] gap-6 items-center w-full"
      style={{backgroundColor: bg}}
    >
      <Link
        href={`/dashboard/myEducation/${enrollment.course_id}`}
        className="w-full flex flex-col gap-3"
      >
        <div className="relative w-full aspect-video rounded-[0.5rem] overflow-hidden">
          <Image src={enrollment?.course_image || "/coursePlaceholder.png"} alt="" fill className={"object-cover"}/>
          <div className={'absolute top-2.5 left-2.5'}>
            {(isFinished || enrollment?.completed_at !== null) && (
              <div className={'bg-white rounded-[6px] py-1 px-2'}>
                <p className={'text-[12px] font-medium text-black'}>Завершено</p>
              </div>
            )}
          </div>
        </div>
        <div className={'flex flex-col gap-3 w-full'}>
          <h2
            className={'text-black text-[20px] font-semibold'}>{enrollment?.course_title || 'Названия курса связанного с налогами и прочее'}</h2>
          <div className={'flex items-center justify-between gap-4'}>
            {/*AUTHOR*/}
            <div className={'flex items-center gap-3'}>
              <Image src={'/avatars.png'} alt={''} width={32} height={32} className={'rounded-full'}/>
              <p className={'text-[1rem] text-black font-medium'}>{enrollment?.author_name || 'Author Name'}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-400 h-full rounded-full"
                style={{width: `${enrollment.progress}%`}}
              ></div>
            </div>
            <span className="text-[12px] font-medium text-black">{enrollment.progress}%</span>
          </div>
        </div>
      </Link>
      {isFinished && (
        <div className={'flex flex-col w-full gap-2'}>
          <button
            onClick={getCertificate}
            className={'px-5 py-3 bg-[#676E76] text-white rounded-[0.5rem] font-medium hover:bg-[#5a5a5a] transition-colors'}>
            Получить сертификат
          </button>
          {!canReviewData?.hasExistingReview && !canReviewLoading && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: Implement review functionality
                setReviewModalOpen(true)
              }}
              className={'px-5 py-3 bg-white text-black rounded-[0.5rem] font-medium hover:bg-gray-50 transition-colors shadow-border'}>
              Оставить отзыв
            </button>
          )}
        </div>
      )}
      <ReviewModal enrollment={enrollment} isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)}/>
    </div>
  );
};
export default MyCourseCard;
