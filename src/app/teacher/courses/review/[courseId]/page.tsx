'use client'
import {useParams} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CourseService} from "@/services/course";
import {useSession} from "@/lib/useSession";
import CourseCard from "@/components/CourseCard";
import {Icon} from "@iconify/react";
import toast from "react-hot-toast";


const accessLabel = (v?: string) => {
  switch (v) {
    case 'lifetime':
      return 'Пожизненно';
    case '1_year':
      return '1 год';
    case '6_months':
      return '6 месяцев';
    case '3_months':
      return '3 месяца';
    default:
      return '—';
  }
};

const formatPrice = (price?: string | number) => {
  const n = Number(price);
  if (!Number.isFinite(n)) return '—';
  return `$${Math.round(n)}`;
};

const CourseReviewById = () => {
  const {session, ready} = useSession();
  const queryClient = useQueryClient();
  const {courseId} = useParams();
  const course_id = Array.isArray(courseId) ? courseId[0] : courseId ?? "";

  const {data: course, isLoading, error} = useQuery({
    queryKey: ["course", course_id, session?.token],
    queryFn: () => CourseService.getCourseById(course_id, session!.token),
    enabled: !!course_id && !!session?.token,
  });
  console.log("COURSE", course_id, course);

  const {mutate: togglePublish, isPending: toggling} = useMutation({
    mutationFn: ({id, isPublished}: { id: number; isPublished: boolean }) =>
      CourseService.updateCoursePublishStatus(id, isPublished, session!.token),
    onSuccess: async () => {
      toast.success("Ста тус курса обновлён");
      await queryClient.invalidateQueries({queryKey: ["course"]});
    },
    onError: (err: any) => {
      toast.error(err?.message || "Ошибка обновления статуса");
    },
  });

  if (isLoading) {
    return <div className="px-10 py-5">Loading...</div>;
  }
  if (!course) return <div className="px-10 py-5">Course not found</div>;
  return (
    <div className={'w-full h-full px-10'}>
      <div className="w-full h-full p-6 flex flex-col bg-white rounded-[20px] gap-6">
        <div className={'flex gap-2.5'}>
          <div className={'flex w-2/3 flex-col gap-5'}>
            {/* Title */}
            <div className="flex gap-8">
              <div className="w-32 text-xs text-[#4B5563] font-medium">Название</div>
              <div className="text-sm font-semibold text-black">
                {course.title}
              </div>
            </div>

            {/* Description */}
            <div className="flex gap-8">
              <div className="w-32 text-xs text-[#4B5563] font-medium">Описание</div>
              <div className="text-sm font-medium text-black">
                {course.description}
              </div>
            </div>

            {/* Access */}
            <div className="flex gap-8">
              <div className="w-32 text-xs text-[#4B5563] font-medium">
                Доступ у студента
              </div>
              <div className="text-sm font-semibold text-black">
                {accessLabel(course.access_duration)}
              </div>
            </div>

            {/* Price */}
            <div className="flex gap-8">
              <div className="w-32 text-xs text-[#4B5563] font-medium">Цена</div>
              <div className="text-sm font-semibold text-black">
                {formatPrice(course.price)}
              </div>
            </div>

            {/* Category */}
            <div className="flex gap-8">
              <div className="w-32 text-xs text-[#4B5563] font-medium">Категория</div>
              <div className="text-sm font-semibold text-black">
                Категория #{course.category_id}
              </div>
            </div>
          </div>

          {/*LEFT*/}
          <div className={'flex w-1/3 flex-col gap-2.5'}>
            <h2 className={'text-base font-semibold text-black'}>Превью карточки</h2>
            <div className="pointer-events-none">
              <CourseCard
                isInCoursesPage={true}
                course={course}
                // onFavoriteToggle={handleFavoriteToggle}
                key={course.id}
              />
            </div>
          </div>
        </div>
        <div className={'flex justify-end'}>
          <button
            onClick={() =>
              togglePublish({
                id: course.id,
                isPublished: !course.is_published,
              })
            }
            className={'bg-[#EE7A67] px-4 py-3 flex items-center gap-2 text-white text-base font-semibold rounded-lg'}>
            {course.is_published ? 'Скрыть курс' : 'Опубликовать'}
            {!course.is_published && (
              <Icon icon={'mingcute:arrow-right-line'} className={'w-5 h-5'}/>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewById;
