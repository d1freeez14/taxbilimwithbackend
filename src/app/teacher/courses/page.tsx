'use client'
import {Icon} from "@iconify/react/dist/iconify.js";
import {useEffect, useRef, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Student} from "@/types/student";
import {Course} from "@/types/course";
import {useSession} from "@/lib/useSession";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CourseService} from "@/services/course";
import Link from "next/link";
import toast from "react-hot-toast";


const TeacherCoursesPage = () => {
  const {session, ready} = useSession();

  const [sortBy, setSortBy] = useState('Популярности');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const sortOptions = [
    'Популярности',
    'Новизне',
    'Рейтингу',
    'Цене: по возрастанию',
    'Цене: по убыванию',
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!isCategoryOpen) return;

      const target = e.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setIsCategoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCategoryOpen]);

  const {data, isLoading, error} = useQuery({
    queryKey: ["my-teacher-courses"],
    queryFn: () => CourseService.getTeacherCourses(session!.token),
    enabled: !!session?.token,
  });
  const {data: categories, isLoading: isCategoriesLoading} = useQuery({
    queryKey: ["categories"],
    queryFn: () => CourseService.getCategories(session!.token),
    enabled: !!session?.token,
  });

  const queryClient = useQueryClient();

  const { mutate: togglePublish, isPending: toggling } = useMutation({
    mutationFn: ({ id, isPublished }: { id: number; isPublished: boolean }) =>
      CourseService.updateCoursePublishStatus(id, isPublished, session!.token),
    onSuccess: async () => {
      toast.success("Статус публикации обновлён");
      await queryClient.invalidateQueries({ queryKey: ["my-teacher-courses"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Ошибка обновления статуса");
    },
  });

  if (isLoading || isCategoriesLoading) {
    return <div>Loading...</div>;
  }

  const filteredCourses = data?.courses.filter((course) => {
    const bySearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const byCategory = selectedCategory ? course.category_id === selectedCategory : true;
    return bySearch && byCategory;
  });

  return (
    <div className={'w-full h-full flex flex-col gap-8 px-10 pb-10'}>
      <div className={'flex w-full justify-between items-center'}>
        {/* SEARCH */}
        <div className={'flex items-center justify-between gap-2 py-4 px-5 bg-white rounded-[10px] w-[35%]'}>
          <input
            type="text"
            placeholder="Введите название курса?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={'w-full outline-none text-[12px]'}
          />
          <Icon icon={'mingcute:search-line'} className={'w-[18px] h-[18px] text-black'}/>
        </div>

        {/* CATEGORY SIMPLE DROPDOWN */}
        <div className="relative">
          <button
            ref={btnRef}
            onClick={() => setIsCategoryOpen(prev => !prev)}
            className={`flex items-center gap-3 px-5 py-4 rounded-[10px] bg-[#EE7A67] text-white `}
          >
            <Icon icon={'ic:round-space-dashboard'} className={'w-[18px] h-[18px]'}/>
            <p className={'text-[12px] font-medium'}>
              {selectedCategory
                ? categories?.find(c => c.id === selectedCategory)?.name
                : 'Категория'}
            </p>
            <Icon icon={isCategoryOpen ? "mdi:chevron-up" : "mdi:chevron-down"} className="w-[18px] h-[18px]"/>
          </button>

          {isCategoryOpen && (
            <div ref={dropdownRef}
                 className="absolute top-full right-0 mt-1 bg-white border rounded-[10px] shadow z-10 min-w-[200px]">

              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setIsCategoryOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Все категории
              </button>

              {categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setIsCategoryOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={'flex w-full h-full overflow-y-scroll bg-white rounded-[20px] p-4'}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap text-[#374151] text-[14px] font-semibold">Название</TableHead>
              <TableHead className="whitespace-nowrap text-[#374151] text-[14px] font-semibold">Категория</TableHead>
              <TableHead className="whitespace-nowrap text-[#374151] text-[14px] font-semibold">Студенты</TableHead>
              <TableHead className="whitespace-nowrap text-[#374151] text-[14px] font-semibold">Статус</TableHead>
              <TableHead className="whitespace-nowrap text-[#374151] text-[14px] font-semibold">Действие</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses?.map((course) => (
              <TableRow key={course.id} className={'text-[16px] font-medium'}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={'/coursePlaceholder.png'}
                      alt={course.title}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <div className={'flex flex-col gap-1'}>
                      <p className={'text-[16px] font-semibold'}>
                        {course.title}
                      </p>
                      <p className={'text-[#4B5563] text-[12px]'}>2h 32min</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  className={'text-[14px] font-medium text-[#4B5563]'}>{categories?.find(c => c.id === course.category_id)?.name || '—'}</TableCell>
                <TableCell className={'text-[14px] font-medium'}>
                  <div className="flex items-center gap-2">
                    {course.enrollment_count}
                  </div>
                </TableCell>
                <TableCell>
                  {/*<Badge*/}
                  {/*  variant="outline"*/}
                  {/*  className={`*/}
                  {/*    ${*/}
                  {/*    course.status === "Completed"*/}
                  {/*      ? "bg-[#F0FDF4] text-[#22C55E]"*/}
                  {/*      : "bg-[#FEFCE8] text-[#EAB308]"*/}
                  {/*  } rounded-[4px] border-none text-[12px] font-medium*/}
                  {/*  `}*/}
                  {/*>*/}
                  {/*  {course.status}*/}
                  {/*</Badge>*/}
                </TableCell>
                <TableCell className={'flex items-center'}>
                  <button
                    className="bg-transparent p-2"
                    disabled={toggling}
                    onClick={() =>
                      togglePublish({
                        id: course.id,
                        isPublished: !course.is_published,
                      })
                    }
                  >
                    {course.is_published ? (
                      <Icon icon="mdi:eye-outline" className="w-5 h-5 text-[#4B5563]" />
                    ) : (
                      <Icon icon="mdi:eye-off-outline" className="w-5 h-5 text-[#4B5563]" />
                    )}
                  </button>
                  <Link href={`/teacher/courses/${course.id}`} className={'p-2'}>
                    <Icon icon={'tabler:edit'} className={'w-5 h-5 text-[#4B5563]'}/>
                  </Link>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeacherCoursesPage;
