'use client'
import CourseCard from "@/components/CourseCard";
import {Icon} from "@iconify/react";
import {useEffect, useMemo, useRef, useState} from "react";
import courses from "@/static/courses.json"
import {useSession} from "@/lib/useSession";
import {CourseService} from "@/services/course";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {useDebounce} from "@/lib/useDebounce";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 12;

const AllCoursesPage = () => {
  const { session, ready } = useSession();
  const [sortBy, setSortBy] = useState('Популярности');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const sortOptions = [
    'Популярности',
    'Новизне',
    'Рейтингу',
    'Цене: по возрастанию',
    'Цене: по убыванию',
  ];
  const listTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory]);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["courses", session?.token, page, PAGE_SIZE, debouncedSearch, selectedCategory],
    enabled: !!session?.token && ready,
    queryFn: () =>
      CourseService.getAllCourses(session!.token, {
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
        category: selectedCategory,
      }),
    placeholderData: keepPreviousData,
  });

  const visibleCourses = useMemo(() => {
    console.log("FETCHED")
    const list = data?.courses ?? [];
    return showFavoritesOnly ? list.filter(c => c.is_favorite) : list;
  }, [data?.courses, showFavoritesOnly]);

  const pages = data?.pagination?.pages ?? 1;

  useEffect(() => {
    if (!data) return;
    if (isFetching) return; // ждём пока закончится fetching
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page, data, isFetching]);

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
      <div ref={listTopRef} />
      <div className={'flex flex-wrap gap-6'}>
        {isLoading ? (
          <div className="w-full text-center py-10">
            <p className="text-gray-600">Loading courses...</p>
          </div>
        ) : visibleCourses.length === 0 ? (
          <div className="w-full text-center py-10">
            <p className="text-gray-600">No courses found</p>
          </div>
        ) : (
          visibleCourses
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
      {/* Footer: pagination + fetching indicator */}
      <div className="w-full flex items-center justify-between">
        <Pagination
          page={page}
          pages={pages}
          onPageChange={setPage}
          disabled={isFetching}
        />
        {isFetching && (
          <p className="text-[12px] text-gray-500">Updating...</p>
        )}
      </div>
    </div>
  );
};

export default AllCoursesPage;
