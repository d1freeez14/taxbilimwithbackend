'use client'
import {IconMain} from "@/shared/icons/IconMain";
import {Icon} from "@iconify/react";
import {IconCourses} from "@/shared/icons/IconCourses";
import Image from "next/image";
import CourseProgram from "@/components/CourseProgram";
import Reviews from "@/components/Reviews";
import courses from "@/static/courses.json"
import {useParams} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {useSession} from "@/lib/useSession";
import {CourseService} from "@/services/course";

const pluralizeRu = (count: number, [one, few, many]: [string, string, string]) => {
  const n = Math.abs(count) % 100;
  const d = n % 10;
  const word =
    n > 10 && n < 20 ? many :
      d === 1 ? one :
        d >= 2 && d <= 4 ? few : many;

  return `${count} ${word}`;
};

const pluralizeModules   = (c: number) => pluralizeRu(c, ["Модуль", "Модуля", "Модулей"]);
const pluralizeLessons   = (c: number) => pluralizeRu(c, ["видеоурок", "видеоурока", "видеоуроков"]);

const CoursePageById = () => {
  const {getSession} = useSession();
  const session = getSession();
  const {courseId} = useParams();
  const id = Array.isArray(courseId) ? courseId[0] : courseId

  const {data: course, isLoading, error} = useQuery({
    queryKey: ["course", id, session?.token],
    queryFn: () => CourseService.getCourseById(id, session!.token),
    enabled: !!id && !!session?.token,
  });
  console.log(course);

  if (isLoading) {
    return <div className="px-10 py-5">Loading...</div>;
  }

  if (error || !course) {
    return <div className="px-10 py-5">Failed to load course.</div>;
  }

  return (
    <div className={'w-full h-full flex flex-col px-10 py-5 gap-5'}>
      <div className={'flex items-center gap-1'}>
        <div className={'flex items-center gap-2 text-[#9EA5AD]'}>
          <IconMain/>
          <p className={'text-[#9EA5AD] text-[14px] font-semibold'}>Главная</p>
        </div>
        <Icon icon={'material-symbols:chevron-right'} className={'text-[#9EA5AD] w-[18px] h-[18px]'}/>
        <div className={'flex items-center gap-2 text-[#9EA5AD]'}>
          <IconCourses/>
          <p className={'text-[#9EA5AD] text-[14px] font-semibold'}>Все курсы</p>
        </div>
        <Icon icon={'material-symbols:chevron-right'} className={'text-[#9EA5AD] w-[18px] h-[18px]'}/>
        <div className={'flex items-center gap-2 text-[#9EA5AD]'}>
          <Icon icon={'gridicons:menus'} className={'text-black w-[18px] h-[18px]'}/>
          <p className={'text-black text-[14px] font-semibold'}>
            {course.title}
          </p>
        </div>
      </div>

      <div className={'w-full h-full flex gap-8 items-start'}>
        <div className={'w-[70%] bg-white p-6 flex flex-col gap-8 rounded-[20px]'}>
          {/*UPPER TEXT PART*/}
          <div className={'flex flex-col gap-4'}>
            <div className={'flex items-center gap-2.5'}>
              <div className={'flex items-center gap-2 pr-2.5 border-r border-[#DFDFDF]'}>
                <Image src={'/avatars.png'} alt={''} width={32} height={32} className={'rounded-full'}/>
                <p className={'text-[1rem] text-black font-medium'}>{course.author_name}</p>
              </div>
              <p className={'text-[14px] text-[#DFDFDF]'}>{course.author_bio}</p>
            </div>
            <h1 className={'text-[30px] text-black font-semibold'}>
              {course.title}
            </h1>
            <div className={'flex items-center gap-2 justify-between'}>
              <div className={'flex items-center gap-4'}>
                <div className={'flex items-center gap-1'}>
                  <Icon icon={'solar:document-text-outline'} className={'text-[#676E76] w-[16px] h-[16px]'}/>
                  <p
                    className={'text-[14px] text-[#676E76] font-medium leading-none'}>{pluralizeModules(course.modules?.length ?? 0)}</p>
                </div>
                <div className={'flex items-center gap-1'}>
                  <Icon icon={'mingcute:time-line'} className={'text-[#676E76] w-[16px] h-[16px]'}/>
                  <p className={'text-[14px] text-[#676E76] font-medium leading-none'}>{course.statistics?.formattedDuration}</p>
                </div>
              </div>
              <div className={'flex items-center gap-4'}>
                <div className={'flex items-center gap-1'}>
                  <Icon icon={'uil:user'} className={'text-[#676E76] w-[16px] h-[16px]'}/>
                  <p className={'text-[14px] text-[#676E76] font-medium'}>{course.enrollment_count} студентов</p>
                </div>
                <div className={'flex items-center gap-1'}>
                  <Icon icon={'iconamoon:like-fill'} className={'text-[#EE7A67] w-[16px] h-[16px]'}/>
                  <p
                    className={'text-[14px] text-[#676E76] font-medium'}>{course.reviews?.statistics.average} ({course.review_count} отзывов)</p>
                </div>
              </div>
            </div>
          </div>
          {/*VIDEO*/}
          <div className={'relative w-full aspect-video '}>
            <Image src={course.image_src} alt={''} fill objectFit={'cover'}/>
          </div>
          {/*WHAT YOU LEARN*/}
          <div className={'flex flex-col gap-6'}>
            <h2 className={'text-black text-[24px] font-semibold'}>Чему вы научитесь?</h2>
            <div className={'flex flex-wrap gap-x-5 gap-y-4 w-full justify-between'}>
              {(course.what_you_learn || []).map((item, index) => (
                <div key={index} className={'flex items-center gap-2.5 w-[47.5%]'}>
                  <Icon icon={'teenyicons:tick-circle-solid'} className={'text-[#EE7A67] w-[24px] h-[24px]'}/>
                  <p className={'text-black text-[14px]'}>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <CourseProgram course={course}/>
          <hr className={'border-t border-[#E5E7EA]'}/>
          <div className={'flex flex-col gap-6'}>
            <h2 className={'text-black text-[24px] font-semibold'}>Описание</h2>
            <p className={'text-black text-[14px]'}>
              {course.description}
            </p>
          </div>
          {/*AUTHOR*/}
          <hr className={'border-t border-[#E5E7EA]'}/>
          <div className={'flex flex-col gap-6'}>
            <div className={'flex gap-3'}>
              <div className={'w-20 h-20 rounded-full relative'}>
                <Image src={course.author_avatar ?? '/avatars.png'} alt={''} fill className={'rounded-full'}/>
              </div>
              <div className={'flex flex-col gap-1.5'}>
                <h3 className={'text-black text-[24px] font-semibold'}>{course.author_name}</h3>
                <p className={'text-[#676E76] text-[14px] font-medium'}>{course.author_bio}</p>
                <div className={'flex items-center gap-2'}>
                  <div className={'flex items-center gap-1'}>
                    <Icon icon={'solar:star-bold'} className={'text-[#FBBC55] w-[18px] h-[18px]'}/>
                    <p className={'text-[14px] text-[#676E76] font-medium'}>4.8 рейтинг (46)</p>
                  </div>
                  <div className={'flex items-center gap-1'}>
                    <Icon icon={'mdi:users-group-outline'} className={'text-[#676E76] w-[18px] h-[18px]'}/>
                    <p className={'text-[14px] text-[#676E76] font-medium'}>2 089 студентов</p>
                  </div>
                  <div className={'flex items-center gap-1'}>
                    <Icon icon={'fa-solid:tasks'} className={'text-[#676E76] w-[18px] h-[18px]'}/>
                    <p className={'text-[14px] text-[#676E76] font-medium'}>7 статей</p>
                  </div>
                </div>
              </div>
            </div>
            <p className={'text-black text-[14px]'}>
              Lorem ipsum dolor sit amet consectetur. Convallis pulvinar mattis integer tincidunt integer bibendum
              integer in. Nisl eu dui facilisi sit tristique pretium in. Metus lectus semper odio sit consectetur nibh.
              Non ac euismod nunc quam etiam. Nam massa cursus non quam turpis molestie sed sem.
              Sed magna in orci amet vulputate integer pharetra ipsum cum. Consectetur vivamus pellentesque aliquet
              nulla maecenas donec arcu eu ut. Fames dictum cum nullam adipiscing eget...Подробнее
            </p>
          </div>
          <hr className={'border-t border-[#E5E7EA]'}/>
          <Reviews reviews={course?.reviews} reviews_count={course?.review_count.toString()}/>
        </div>

        {/*RIGHT SECTION*/}

        <div className={'w-[30%] bg-white rounded-[20px] flex flex-col gap-6 p-6'}>
          <div className={'flex flex-col gap-4'}>
            <h2 className={'text-black text-[24px] font-semibold'}>
              Что входит в курс:
            </h2>
            <div className={'flex flex-col gap-3'}>
              {(course.features || []).map((feature, index) => (
                <div key={index} className={'flex items-center gap-2'}>
                  <Icon icon={'solar:document-text-outline'} className={'text-[#383F45] w-6 h-6'}/>
                  <p className={'text-[16px] text-[#383F45] font-medium'}>{feature}</p>
                </div>
              ))}
            </div>
          </div>
          <hr className={'border-t border-[#E5E7EA]'}/>
          <div className={'flex items-end gap-4'}>
            <h2 className={'text-[30px] font-bold text-black'}>{parseInt(course.price.toString(), 10)} ₸</h2>
            {/*<p className={'text-[24px] text-[#676E76] line-through'}>25 990 ₸</p>*/}
          </div>
          <div className={'flex flex-col gap-2'}>
            <button
              className={'py-3.5 px-5 w-full bg-[#EE7A67] text-white text-[16px] font-semibold rounded-[0.5rem]'}>Приобрести
              курс
            </button>
            <button
              className={'py-3.5 px-5 w-full border border-[#676E76] rounded-[0.5rem] flex justify-center items-center gap-2.5'}>
              <Icon icon={'material-symbols-light:star-outline'} className={'text-[#676E76] w-6 h-6 p-0'}/>
              <p className={'text-[#676E76] text-[16px] font-semibold'}>Сохранить в избранных</p>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CoursePageById;