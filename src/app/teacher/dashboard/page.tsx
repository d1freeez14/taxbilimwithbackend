'use client'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useState} from "react";
import {Icon} from "@iconify/react";
import DashboardInfoCards from "@/components/teacherDashboard/DashboardInfoCards";
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
import DashboardStudentsTable from "@/components/teacherDashboard/DashboardStudentsTable";
import {useQuery} from "@tanstack/react-query";
import {StudentsService} from "@/services/students";
import {useSession} from "@/lib/useSession";
import {SalesService} from "@/services/sales";
import {MonthlyStat, TopCourse} from "@/types/sales";
import SalesCardBarChart from "@/components/teacherDashboard/SalesCardBarChart";
import SalesCardPieChart from "@/components/teacherDashboard/SalesCardPieChart";

const TeacherDashboard = () => {
  const { session, ready } = useSession();

  const [month, setMonth] = useState<string>("system")
  const {data: studentsData, isLoading: studentsLoading, error: studentsError} = useQuery({
    queryKey: ["my-teacher-students"],
    queryFn: () => StudentsService.getTeacherStudents(session!.token),
    enabled: !!session?.token,
  });

  const {data: dashboardData, isLoading, error} = useQuery({
    queryKey: ["my-teacher-dashboard"],
    queryFn: () => SalesService.getTeacherDashboardStats(session!.token),
    enabled: !!session?.token,
  });
  console.log(dashboardData)

  return (
    <div className={'flex flex-col gap-8 p-10 w-full h-full '}>
      <div className={'absolute w-full h-[350px] px-5 top-0 left-0 z-[-1]'}>
        <div className={'w-full h-full bg-[#676E76] rounded-b-[32px]'}>
        </div>
      </div>
      <div className={'w-full flex justify-between gap-5'}>
        <div className={'flex flex-col'}>
          <h1 className={'text-white text-[36px] font-bold'}>Привет, {session?.user.name}👋</h1>
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
        <DashboardInfoCards type={'income'} data={dashboardData?.monthly_stats[0]?.revenue ?? 0}/>
        <DashboardInfoCards type={'soldCourses'} data={dashboardData?.monthly_stats[0]?.enrollments ?? 0}/>
        <DashboardInfoCards type={'studentNumber'} data={studentsData?.students?.length ?? 0}/>
      </div>
      {/*CHARTS AND TABLE*/}
      <div className={'flex flex-col gap-5 w-full'}>
        <div className={'flex justify-between gap-5'}>
          <SalesCardBarChart monthlyStats={dashboardData?.monthly_stats ?? []}/>
          <SalesCardPieChart topCourses={dashboardData?.top_courses ?? []}/>
        </div>
        <DashboardStudentsTable students={studentsData?.students ?? []}/>
      </div>
    </div>
  );
};

export default TeacherDashboard;
