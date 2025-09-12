'use client'
import {Student} from "@/types/student";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import { useMemo } from "react";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

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
// --- Sales data (example) ---
type Point = {
  month: string;
  revenue: number; // выручка
  refund: number;  // возврат
  sold: number;    // продано курсов
  returns: number; // возвраты (шт)
};

const salesData: Point[] = [
  { month: 'Jan', revenue: 2200, refund: 900,  sold: 20, returns: 3 },
  { month: 'Feb', revenue: 3100, refund: 1000, sold: 28, returns: 5 },
  { month: 'Mar', revenue: 1500, refund: 900,  sold: 18, returns: 2 },
  { month: 'Apr', revenue: 900,  refund: 400,  sold: 10, returns: 1 },
  { month: 'May', revenue: 1200, refund: 500,  sold: 12, returns: 1 },
  { month: 'Jun', revenue: 1700, refund: 700,  sold: 16, returns: 2 },
  { month: 'Jul', revenue: 4100, refund: 900,  sold: 34, returns: 6 },
  { month: 'Aug', revenue: 1300, refund: 800,  sold: 13, returns: 2 },
  { month: 'Sep', revenue: 1400, refund: 500,  sold: 14, returns: 1 },
  { month: 'Oct', revenue: 1000, refund: 600,  sold: 11, returns: 2 },
  { month: 'Nov', revenue: 3300, refund: 900,  sold: 26, returns: 4 },
  { month: 'Dec', revenue: 1900, refund: 400,  sold: 15, returns: 2 },
];

// --- Helpers ---
const fmtMoney = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const axisMoneyK = (n: number) => {
  if (n === 0) return '$0K';
  return `$${Math.round(n / 1000)}K`;
};

const TeacherSalesPage = () => {
  const totals = useMemo(() => {
    const sumRevenue = salesData.reduce((a, p) => a + p.revenue, 0);
    const sumRefund = salesData.reduce((a, p) => a + p.refund, 0);
    const sold = salesData.reduce((a, p) => a + p.sold, 0);
    const returns = salesData.reduce((a, p) => a + p.returns, 0);
    const avgPrice = sold ? Math.round(sumRevenue / sold) : 0;
    return { sumRevenue, sumRefund, sold, returns, avgPrice };
  }, []);
  return (
    <div className={'w-full h-full flex flex-col gap-8 px-10 pb-10'}>
      <div className="w-full bg-white rounded-[20px] p-6 flex gap-8 items-stretch">
        {/* Left KPIs */}
        <div className="w-[320px] shrink-0 flex flex-col gap-6">
          {/* Total Revenue */}
          <div>
            <div className="text-[#676E76] text-sm font-medium flex items-center gap-2">
              Общий доход <span className="text-emerald-500">↑ 17%</span>
            </div>
            <div className="text-4xl md:text-5xl font-bold mt-2">{fmtMoney(totals.sumRevenue)}</div>
          </div>

          <div className="h-px bg-[#F0F2F5]" />

          {/* Sold */}
          <div>
            <div className="text-[#676E76] text-sm font-medium flex items-center gap-2">
              Продано курсов <span className="text-emerald-500">↑ 14%</span>
            </div>
            <div className="text-4xl font-bold mt-2">{totals.sold}</div>
          </div>

          <div className="h-px bg-[#F0F2F5]" />

          {/* Avg price */}
          <div>
            <div className="text-[#676E76] text-sm font-medium flex items-center gap-2">
              Средняя цена <span className="text-emerald-500">↑ 9%</span>
            </div>
            <div className="text-4xl font-bold mt-2">{totals.avgPrice}</div>
          </div>

          <div className="h-px bg-[#F0F2F5]" />

          {/* Returns (count) */}
          <div>
            <div className="text-[#676E76] text-sm font-medium flex items-center gap-2">
              Возвраты <span className="text-red-500">↓ 13%</span>
            </div>
            <div className="text-4xl font-bold mt-2">{totals.returns.toLocaleString('en-US')}</div>
          </div>
        </div>

        {/* Right: Chart */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[24px] font-semibold">Продажи</h3>
            {/* (optional) mini filters could go here */}
          </div>
          <div className="text-[28px] font-bold">{fmtMoney(totals.sumRevenue)}</div>

          <div className="w-full h-[320px] md:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} barCategoryGap={24}>
                <CartesianGrid vertical={false} stroke="#EEF1F4" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis
                  tickFormatter={axisMoneyK}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  domain={[0, 5000]}
                />
                <Tooltip
                  formatter={(value: number, name) =>
                    [fmtMoney(value), name === 'revenue' ? 'Выручка' : 'Возврат']
                  }
                  labelFormatter={(label) => `Месяц: ${label}`}
                  cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  formatter={(val) => (val === 'revenue' ? 'Выручка' : 'Возврат')}
                  wrapperStyle={{ paddingBottom: 12 }}
                />
                {/* Stack to achieve the two-tone single bar look like the screenshot */}
                <Bar
                  dataKey="refund"
                  stackId="a"
                  fill="#F26355"     // возврат (оранжево-красный)
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="revenue"
                  stackId="a"
                  fill="#EAECEF"     // выручка (светло-серый)
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={'w-full flex flex-col gap-6 p-6 bg-white rounded-[20px]'}>
        <h2 className={'text-[24px] font-semibold'}>Студенты</h2>
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

export default TeacherSalesPage;