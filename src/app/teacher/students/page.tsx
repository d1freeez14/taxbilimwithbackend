'use client'
import {useState} from "react";
import {Icon} from "@iconify/react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Student} from "@/types/student";

const students: Student[] = [
  {
    order: "#890221",
    name: "Darlene Robertson",
    avatar: "/avatars.png",
    date: "Jan 31, 2023",
    course: "How to Become an Expert in...",
    courseImg: "/courseVideo.png",
    price: "$120",
    status: "Completed",
  },
  {
    order: "#890222",
    name: "Andy Smith",
    avatar: "/avatars.png",
    date: "Jan 15, 2025",
    course: "Frontend",
    courseImg: "/courseVideo.png",
    price: "$1200",
    status: "Pending",
  },
]
const TeacherStudentsPage = () => {
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
              <TableHead className="whitespace-nowrap">№ заказа</TableHead>
              <TableHead className="whitespace-nowrap">Имя студента</TableHead>
              <TableHead className="whitespace-nowrap">Дата</TableHead>
              <TableHead className="whitespace-nowrap">Название курса</TableHead>
              <TableHead className="whitespace-nowrap">Цена</TableHead>
              <TableHead className="whitespace-nowrap">Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((s) => (
              <TableRow key={s.order} className={'text-[16px] font-medium'}>
                <TableCell className="font-medium">{s.order}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={s.avatar}
                      alt={s.name}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    {s.name}
                  </div>
                </TableCell>
                <TableCell>{s.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={s.courseImg}
                      alt={s.course}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    {s.course}
                  </div>
                </TableCell>
                <TableCell>{s.price}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`
                      ${
                      s.status === "Completed"
                        ? "bg-[#F0FDF4] text-[#22C55E]"
                        : "bg-[#FEFCE8] text-[#EAB308]"
                    } rounded-[4px] border-none text-[12px] font-medium
                    `}
                  >
                    {s.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeacherStudentsPage;