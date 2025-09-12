'use client'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useState} from "react";
import {Icon} from "@iconify/react";
import DashboardInfoCards from "@/components/DashboardInfoCards";
import {SelectIcon} from "@radix-ui/react-select";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis} from "recharts";
import {Student} from "@/types/student";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import Image from "next/image";

const TeacherDashboard = () => {
  const [month, setMonth] = useState<string>("system")

  return (
    <div className={'flex flex-col gap-8 p-10 w-full h-full '}>
      <div className={'absolute w-full h-[350px] px-5 top-0 left-0 z-[-1]'}>
        <div className={'w-full h-full bg-[#676E76] rounded-b-[32px]'}>
        </div>
      </div>
      <div className={'w-full flex justify-between gap-5'}>
        <div className={'flex flex-col'}>
          <h1 className={'text-white text-[36px] font-bold'}>Привет, Сандугаш👋</h1>
          <p className={'text-white text-[16px]'}>С нами вы сможете легко управлять данными о ваших онлайн-курсах</p>
        </div>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger
            className="w-[160px] h-[56px] px-6 bg-transparent border border-white focus:outline-none focus:ring-0 focus:ring-offset-0 text-white">
            <SelectValue placeholder="Theme" className={'text-white'}/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/*INFO CARDS*/}
      <div className={'flex items-center justify-between gap-5'}>
        <DashboardInfoCards/>
        <DashboardInfoCards/>
        <DashboardInfoCards/>
      </div>
      {/*CHARTS AND TABLE*/}
      <div className={'flex flex-col gap-5 w-full'}>
        <div className={'flex justify-between gap-5'}>
          <SalesCardBarChart/>
          <SalesCardPieChart/>
        </div>
        <StudentTableDashboard/>
      </div>
    </div>
  );
};

const SalesCardBarChart = () => {
  const data = [
    {month: "Jan", revenue: 3000, returns: 1000},
    {month: "Feb", revenue: 2700, returns: 650},
    {month: "Mar", revenue: 2400, returns: 1200},
    {month: "Apr", revenue: 2100, returns: 600},
    {month: "May", revenue: 2600, returns: 500},
    {month: "Jun", revenue: 2800, returns: 300},
    {month: "Jul", revenue: 4200, returns: 350},
    {month: "Aug", revenue: 3100, returns: 450},
    {month: "Sep", revenue: 3200, returns: 150},
    {month: "Oct", revenue: 2200, returns: 300},
    {month: "Nov", revenue: 3500, returns: 700},
    {month: "Dec", revenue: 4000, returns: 500},
  ]

  const chartConfig = {
    revenue: {label: "Выручка", color: "#EE7A67"},
    returns: {label: "Возврат", color: "#D1D5DB"},
  } satisfies ChartConfig

  const [course, setCourse] = useState<string>("all")
  const [period, setPeriod] = useState<string>("thisMonth")

  const total = data.reduce((sum, {revenue, returns}) => sum + revenue - returns, 0)

  return (
    <Card className="space-y-4 flex-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={'text-[24px] font-semibold'}>Продажи</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger className="w-[130px] h-[40px] px-3 text-[12px] font-semibold">
                <SelectValue placeholder="Название курса"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все курсы</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="vue">Vue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[200px] h-[40px] px-3 text-[12px] font-semibold">
                <SelectValue placeholder="Период"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisMonth">Этот месяц (1–31 июля)</SelectItem>
                <SelectItem value="lastMonth">Прошлый месяц</SelectItem>
                <SelectItem value="year">Этот год</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-[40px] px-3 flex items-center gap-2 text-[12px] font-semibold">
              <Icon icon={'mi:export'} className={'w-4 h-4'}/>
              Экспорт
            </Button>
          </div>
        </div>
      </CardHeader>
      <div className="w-full px-6 flex items-center justify-between mb-4">
        <div>
          <CardDescription className="text-[30px] font-semibold mt-1 text-black">
            ${total.toLocaleString()}
          </CardDescription>
        </div>

        {/* custom legend */}
        <div className="flex items-center gap-6">
          {Object.entries(chartConfig).map(([key, {label, color}]) => (
            <div key={key} className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{backgroundColor: color}}
              />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <CardContent className={'space-y-4'}>
        <ChartContainer
          config={chartConfig}
          className={'w-full h-[240px]'}
        >
          <BarChart
            data={data}
            margin={{top: 10, right: 20, left: 0, bottom: 0}}
          >
            {/* horizontal grid only */}
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `$${val / 1000}K`}
              domain={[0, "dataMax + 1000"]}
            />

            <ChartTooltip
              content={<ChartTooltipContent/>}
            />

            {/*<ChartLegend*/}
            {/*  align="right"*/}
            {/*  verticalAlign="top"*/}
            {/*  content={<ChartLegendContent />}*/}
            {/*/>*/}

            <Bar
              dataKey="returns"
              stackId="a"
              fill="#EE7A67"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="revenue"
              stackId="a"
              fill="#D1D5DB"
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const SalesCardPieChart = () => {
  // just for a consistent look with your other cards
  const [course, setCourse] = useState("all")
  const [period, setPeriod] = useState("thisMonth")

  const pieConfig: ChartConfig = {
    Design: {label: "Design", color: "#EE7A67"},
    Technology: {label: "Technology", color: "#3B82F6"},
    Marketing: {label: "Marketing", color: "#6EE7B7"},
    SEO: {label: "SEO", color: "#4B5563"},
  }

  // your four course buckets
  const pieData = [
    {name: "Design", value: 400},
    {name: "Technology", value: 300},
    {name: "Marketing", value: 200},
    {name: "SEO", value: 150},
  ]

  return (
    <Card className="flex flex-col gap-4 justify-between p-6">
      <CardHeader className={'p-0'}>
        <CardTitle className={'text-[24px] font-semibold'}>Курсы</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col items-center">
        {/* 2) Wrap your PieChart in ChartContainer and pass the config */}
        <ChartContainer
          config={pieConfig}
          className="w-[300px] h-[300px]"
        >
          <PieChart width={300} height={300}>
            {/* 3) Use shadcn’s tooltip instead of Recharts’ */}
            <ChartTooltip
              // disable the default crosshair cursor
              cursor={false}
              // hide the group label header
              content={<ChartTooltipContent hideLabel/>}
            />

            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              startAngle={225}
              endAngle={-45}
              paddingAngle={2}
              cornerRadius={8}
              labelLine={false}
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={pieConfig[entry.name].color}/>
              ))}
            </Pie>
            <ChartLegend
              align="center"
              verticalAlign="bottom"
              content={<ChartLegendContent/>}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

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
const StudentTableDashboard = () => {
  return (
    <Card className="overflow-auto">
      <div className="w-full p-6 flex items-center justify-between">
        <CardTitle className={'text-[24px] font-semibold'}>Студенты</CardTitle>
        <Button variant="outline" size="sm">
          Показать все &rarr;
        </Button>
      </div>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
export default TeacherDashboard;