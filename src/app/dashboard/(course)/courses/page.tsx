'use client'
import CourseCard from "@/components/CourseCard";
import {Icon} from "@iconify/react";
import {useEffect, useState} from "react";
import courses from "@/static/courses.json"
import {useSession} from "@/lib/useSession";
import {CourseService} from "@/services/course";
import {useQuery} from "@tanstack/react-query";

interface Course {
  id: number;
  title: string;
  description: string;
  image_src: string;
  price: number;
  bg: string;
  is_published: boolean;
  is_sales_leader: boolean;
  is_recorded: boolean;
  is_favorite?: boolean;
  features: string[];
  what_you_learn: string[];
  author_id: number;
  author_name: string;
  author_avatar: string;
  enrollment_count: number;
  review_count: number;
  created_at: string;
  category_id?: number;
}

const AllCoursesPage = () => {
  const {getSession} = useSession();
  const session = getSession();
  const [sortBy, setSortBy] = useState('Популярности');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  const sortOptions = [
    'Популярности',
    'Новизне',
    'Рейтингу',
    'Цене: по возрастанию',
    'Цене: по убыванию',
  ];

  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ["courses", session?.token],
    queryFn: () => CourseService.getAllCourses(session!.token),
    enabled: !!session?.token,
  });

  // const handleFavoriteToggle = (courseId: number, isFavorite: boolean) => {
  //   setCourses(prevCourses =>
  //     prevCourses.map(course =>
  //       course.id === courseId
  //         ? {...course, is_favorite: isFavorite}
  //         : course
  //     )
  //   );
  // };

  return (
    <div className={'flex flex-col items-start gap-8 px-10 py-5 w-full h-full'}>
      <div className={'flex w-full justify-between items-center'}>
        <div className={'flex items-center justify-between gap-2 py-4 px-5 bg-white rounded-[10px] w-[35%]'}>
          <input
            type="text"
            placeholder="Какой курс или какого преподавателя ищете?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={'w-full outline-none text-[12px]'}
          />
          <Icon icon={'mingcute:search-line'} className={'w-[18px] h-[18px] text-black'}/>
        </div>
        <div className={'flex items-center gap-3'}>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-3 px-5 py-4 rounded-[10px] transition-colors ${
              showFavoritesOnly
                ? 'bg-[#EE7A67] text-white'
                : 'bg-white text-black'
            }`}
          >
            <Icon icon={'solar:star-bold'} className={`w-[18px] h-[18px] ${
              showFavoritesOnly ? 'text-white' : 'text-[#EE7A67]'
            }`}/>
            <p className={'text-[12px] font-medium'}>Избранные</p>
          </button>
          <div className="relative">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-3 px-5 py-4 rounded-[10px] transition-colors ${
                selectedCategory === null
                  ? 'bg-[#EE7A67] text-white'
                  : 'bg-white text-black'
              }`}
            >
              <Icon icon={'ic:round-space-dashboard'} className={`w-[18px] h-[18px] ${
                selectedCategory === null ? 'text-white' : 'text-[#EE7A67]'
              }`}/>
              <p className={'text-[12px] font-medium'}>
                {selectedCategory === null
                  ? 'Категория'
                  : categories.find(c => c.id === selectedCategory)?.name || 'Категория'
                }
              </p>
            </button>
            {categories.length > 0 && (
              <div
                className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    selectedCategory === null ? 'bg-gray-100' : ''
                  }`}
                >
                  Все категории
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      selectedCategory === category.id ? 'bg-gray-100' : ''
                    }`}
                  >
                    {category.name} ({category.course_count})
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={'flex items-center gap-1 px-5 py-4 bg-white rounded-[10px]'}>
            <Icon icon={'fluent:filter-20-filled'} className={'w-[18px] h-[18px] text-[#EE7A67] mr-2'}/>
            <p className={'text-black text-[12px] font-medium'}>Сортировать по :</p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className={"max-w-[100px] text-black text-[12px] font-medium bg-transparent outline-none cursor-pointer appearance-none pr-0"}
            >
              {sortOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className={'flex flex-wrap gap-6'}>
        {isLoading ? (
          <div className="w-full text-center py-10">
            <p className="text-gray-600">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="w-full text-center py-10">
            <p className="text-gray-600">No courses found</p>
          </div>
        ) : (
          courses
            .filter(course => {
              const matchesSearch =
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.author_name.toLowerCase().includes(searchTerm.toLowerCase());

              const matchesFavorites = !showFavoritesOnly || course.is_favorite;

              const matchesCategory = selectedCategory === null || course.category_id === selectedCategory;

              return matchesSearch && matchesFavorites && matchesCategory;
            })
            .map((course) => (
              <CourseCard
                isInCoursesPage={true}
                course={course}
                // onFavoriteToggle={handleFavoriteToggle}
                key={course.id}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default AllCoursesPage;