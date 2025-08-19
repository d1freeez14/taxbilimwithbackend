'use client'
import {IconMain} from "@/shared/icons/IconMain";
import {Icon} from "@iconify/react";
import {IconCourses} from "@/shared/icons/IconCourses";
import Image from "next/image";
import CourseProgram from "@/components/CourseProgram";
import Reviews from "@/components/Reviews";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";

interface Course {
  id: number;
  title: string;
  description: string;
  image_src: string;
  price: number;
  bg: string;
  is_published: boolean;
  features: string[];
  what_you_learn: string[];
  author_id: number;
  author_name: string;
  author_avatar: string;
  author_bio: string;
  enrollment_count: number;
  review_count: number;
  created_at: string;
  modules: any[];
}

const CoursePageById = () => {
  const { courseId } = useParams();
  const id = Array.isArray(courseId) ? courseId[0] : courseId;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/courses/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data.course);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-600">Loading course...</p>
      </div>
    );
  }

  const handleFavoriteToggle = async () => {
    if (isLoadingFavorite || !course) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add courses to favorites');
      return;
    }
    
    setIsLoadingFavorite(true);
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
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const handlePurchaseCourse = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to purchase this course');
      return;
    }
    
    // TODO: Implement course purchase logic
    alert('Course purchase functionality will be implemented soon!');
  };

  if (!course) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-600">Course not found</p>
      </div>
    );
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
                <Image src={course.author_avatar} alt={''} width={32} height={32} className={'rounded-full'}/>
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
                  <p className={'text-[14px] text-[#676E76] font-medium'}>{course.modules?.length || 0} Модулей</p>
                </div>
                <div className={'flex items-center gap-1'}>
                  <Icon icon={'mingcute:time-line'} className={'text-[#676E76] w-[16px] h-[16px]'}/>
                  <p className={'text-[14px] text-[#676E76] font-medium'}>12 часов 30 минут</p>
                </div>
              </div>
              <div className={'flex items-center gap-4'}>
                <div className={'flex items-center gap-1'}>
                  <Icon icon={'uil:user'} className={'text-[#676E76] w-[16px] h-[16px]'}/>
                  <p className={'text-[14px] text-[#676E76] font-medium'}>{course.enrollment_count} студентов</p>
                </div>
                <div className={'flex items-center gap-1'}>
                  <Icon icon={'iconamoon:like-fill'} className={'text-[#EE7A67] w-[16px] h-[16px]'}/>
                  <p className={'text-[14px] text-[#676E76] font-medium'}>4.8 ({course.review_count} отзывов)</p>
                </div>
              </div>
            </div>
          </div>
          {/*VIDEO*/}
          <div className={'relative w-full aspect-video '}>
            <Image src={'/courseVideo.png'} alt={''} fill objectFit={'cover'}/>
          </div>
          {/*WHAT YOU LEARN*/}
          <div className={'flex flex-col gap-6'}>
            <h2 className={'text-black text-[24px] font-semibold'}>Чему вы научитесь?</h2>
            <div className={'flex flex-wrap gap-x-5 gap-y-4 w-full justify-between'}>
              {course.what_you_learn?.map((item, index) => (
                <div key={index} className={'flex items-center gap-2.5 w-[47.5%]'}>
                  <Icon icon={'teenyicons:tick-circle-solid'} className={'text-[#EE7A67] w-[24px] h-[24px]'}/>
                  <p className={'text-black text-[14px]'}>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <CourseProgram modules={course.modules}/>
          <hr className={'border-t border-[#E5E7EA]'}/>
          <div className={'flex flex-col gap-6'}>
            <h2 className={'text-black text-[24px] font-semibold'}>Описание</h2>
            <p className={'text-black text-[14px]'}>
              Lorem ipsum dolor sit amet consectetur. Convallis pulvinar mattis integer tincidunt integer bibendum
              integer in. Nisl eu dui facilisi sit tristique pretium in. Metus lectus semper odio sit consectetur nibh.
              Non ac euismod nunc quam etiam. Nam massa cursus non quam turpis molestie sed sem. In ullamcorper vel
              aenean gravida pretium dui fringilla. Convallis eget tortor nunc massa.
              Sed magna in orci amet vulputate integer pharetra ipsum cum. Consectetur vivamus pellentesque aliquet
              nulla maecenas donec arcu eu ut. Fames dictum cum nullam adipiscing eget ipsum nunc. Euismod odio magna
              lectus imperdiet enim. Pellentesque ut facilisi quis a sit accumsan. Tellus aliquet purus diam eget
              pulvinar nibh. Nunc id nibh elit cursus volutpat amet ultrices. Vestibulum neque et in lacus elit
              volutpat. Hac elit dictumst orci proin dictum feugiat. In ultrices augue adipiscing diam laoreet fermentum
              vitae. Amet lacus bibendum ornare eu eget id rutrum sit. Elementum eget at dictum lorem. Nulla sodales et
              egestas pharetra sem et condimentum lacus vitae. Aliquam volutpat fermentum scelerisque morbi blandit
              lectus diam in pellentesque.
              A et sit phasellus laoreet quisque. Mauris mauris enim adipiscing blandit elit etiam lobortis luctus
              vehicula. Ac tortor metus diam quam cursus nam sed ultrices. Morbi lectus a sed augue. Curabitur morbi nam
              tellus euismod sed ipsum amet bibendum luctus. Velit aliquet dolor dolor pellentesque vel facilisis.
              Est habitasse magna cursus purus posuere faucibus blandit enim maecenas. Nulla adipiscing convallis.
            </p>
          </div>
          {/*AUTHOR*/}
          <hr className={'border-t border-[#E5E7EA]'}/>
          <div className={'flex flex-col gap-6'}>
            <div className={'flex gap-3'}>
              <div className={'w-20 h-20 rounded-full relative'}>
                <Image src={'/avatars.png'} alt={''} fill className={'rounded-full'}/>
              </div>
              <div className={'flex flex-col gap-1.5'}>
                <h3 className={'text-black text-[24px] font-semibold'}>Арман Б.</h3>
                <p className={'text-[#676E76] text-[14px] font-medium'}>Специалист по Судебным разбирательствам</p>
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
          <Reviews/>
        </div>
        {/*RIGHT SECTION*/}
        <div className={'w-[30%] bg-white rounded-[20px] flex flex-col gap-6 p-6'}>
          <div className={'flex flex-col gap-4'}>
            <h2 className={'text-black text-[24px] font-semibold'}>
              Что входит в курс:
            </h2>
            <div className={'flex flex-col gap-3'}>
              {course.features?.map((feature, index) => {
                let icon = 'solar:document-text-outline';
                if (feature.includes('видео')) icon = 'hugeicons:computer-video-call';
                else if (feature.includes('статей')) icon = 'icon-park-outline:notebook-and-pen';
                else if (feature.includes('ресурс')) icon = 'solar:download-outline';
                else if (feature.includes('пожизненный')) icon = 'hugeicons:infinity-circle';
                else if (feature.includes('Сертификат')) icon = 'tabler:certificate';
                
                return (
                  <div key={index} className={'flex items-center gap-2'}>
                    <Icon icon={icon} className={'text-[#383F45] w-6 h-6'}/>
                    <p className={'text-[16px] text-[#383F45] font-medium'}>{feature}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <hr className={'border-t border-[#E5E7EA]'}/>
          <div className={'flex items-end gap-4'}>
            <h2 className={'text-[30px] font-bold text-black'}>{course.price?.toLocaleString()} ₸</h2>
            <p className={'text-[24px] text-[#676E76] line-through'}>{course.price?.toLocaleString()} ₸</p>
          </div>
          <div className={'flex flex-col gap-2'}>
            <button
              onClick={handlePurchaseCourse}
              className={'py-3.5 px-5 w-full bg-[#EE7A67] text-white text-[16px] font-semibold rounded-[0.5rem] hover:bg-[#d66a5a] transition-colors'}>
              Приобрести курс
            </button>
            <button 
              onClick={handleFavoriteToggle}
              className={`py-3.5 px-5 w-full border rounded-[0.5rem] flex items-center gap-2.5 transition-colors ${
                isFavorite 
                  ? 'border-[#EE7A67] bg-[#EE7A67] text-white' 
                  : 'border-[#676E76] text-[#676E76] hover:border-[#EE7A67] hover:text-[#EE7A67]'
              }`}>
              <Icon icon={isFavorite ? 'material-symbols-light:star' : 'material-symbols-light:star-outline'} className={'w-5 h-5'}/>
              <p className={'text-[16px] font-semibold'}>
                {isFavorite ? 'Удалить из избранных' : 'Сохранить в избранных'}
              </p>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CoursePageById;