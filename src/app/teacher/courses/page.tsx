'use client'
import {Icon} from "@iconify/react/dist/iconify.js";
import {useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Student} from "@/types/student";
import {Course} from "@/types/course";

const courses = [
  {
    id: 1,
    title: 'Fundamentals of UX Design',
    category: 'Design',
    enrollment_count: 15,
    status: 'Completed',
  },
  {
    id: 2,
    title: 'WordPress  for beginners',
    category: 'Design',
    enrollment_count: 25,
    status: 'Completed',
  },
  {
    id: 3,
    title: 'Programming with React',
    category: 'SEO',
    enrollment_count: 18,
    status: 'Completed',
  },
  {
    id: 4,
    title: 'UX Design for beginners',
    category: 'Technology',
    enrollment_count: 110,
    status: 'Completed',
  },

]

const TeacherCoursesPage = () => {
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


  return (
    <div className={'w-full h-full flex flex-col gap-8 px-10 pb-10'}>
      <div className={'flex w-full justify-between items-center'}>
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
            {courses.map((course) => (
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
                <TableCell className={'text-[14px] font-medium text-[#4B5563]'}>{course.category}</TableCell>
                <TableCell className={'text-[14px] font-medium'}>
                  <div className="flex items-center gap-2">
                    {course.enrollment_count}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`
                      ${
                      course.status === "Completed"
                        ? "bg-[#F0FDF4] text-[#22C55E]"
                        : "bg-[#FEFCE8] text-[#EAB308]"
                    } rounded-[4px] border-none text-[12px] font-medium
                    `}
                  >
                    {course.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button>
                    a
                  </button>
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