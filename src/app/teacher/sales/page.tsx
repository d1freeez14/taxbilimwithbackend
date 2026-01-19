'use client';

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useQuery } from "@tanstack/react-query";

import type { Student } from "@/types/student";
import {useSession} from "@/lib/useSession";
import {DashboardStatsResponse, MonthlyStat} from "@/types/sales";
import {SalesService} from "@/services/sales";
import {StudentsService} from "@/services/students";
import DashboardStudentsTable from "@/components/teacherDashboard/DashboardStudentsTable";

// --- Helpers ---
const fmtMoney = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

const axisMoneyK = (n: number) => {
    if (n === 0) return "$0K";
  return `$${Math.round(n / 1000)}K`;
};

const TeacherSalesPage = () => {
  const { session, ready } = useSession();

  const {
    data: dashboardData,
    isLoading: statsLoading,
    error: statsError
  } = useQuery<DashboardStatsResponse>({
    queryKey: ["my-teacher-dashboard"],
    queryFn: () => SalesService.getTeacherDashboardStats(session!.token),
    enabled: ready && !!session?.token
  });

  const {data: studentsData, isLoading: studentsLoading, error: studentsError} = useQuery({
    queryKey: ["my-teacher-students"],
    queryFn: () => StudentsService.getTeacherStudents(session!.token),
    enabled: !!session?.token,
  });

  const monthlyChartData = useMemo<
    { month: string; revenue: number }[]
  >(() => {
    if (!dashboardData?.monthly_stats) return [];
    return dashboardData.monthly_stats.map((m: MonthlyStat) => ({
      month: m.month,
      revenue: m.revenue
    }));
  }, [dashboardData]);

  const totals = useMemo(() => {
    if (!dashboardData?.stats) {
      return {
        sumRevenue: 0,
        sold: 0,
        avgPrice: 0,
        completedEnrollments: 0
      };
    }

    const s = dashboardData.stats;
    const sumRevenue = s.total_revenue;
    const sold = s.total_enrollments;
    const completedEnrollments = s.completed_enrollments;
    const avgPrice = sold ? Math.round(sumRevenue / sold) : 0;

    return { sumRevenue, sold, avgPrice, completedEnrollments };
  }, [dashboardData]);

  if (statsError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        Failed to load dashboard stats.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-8 px-10 pb-10">
      <div className="w-full bg-white rounded-[20px] p-6 flex gap-8 items-stretch">
        <div className="w-[320px] shrink-0 flex flex-col gap-6">
          <div>
            <div className="text-[#676E76] text-sm font-medium flex items-center gap-2">
              Общий доход <span className="text-emerald-500">↑ 17%</span>
            </div>
            <div className="text-4xl md:text-5xl font-bold mt-2">
              {fmtMoney(totals.sumRevenue)}
            </div>
          </div>

          <div className="h-px bg-[#F0F2F5]" />
          <div>
            <div className="text-[#676E76] text-sm font-medium flex items-center gap-2">
              Продано курсов <span className="text-emerald-500">↑ 14%</span>
            </div>
            <div className="text-4xl font-bold mt-2">{totals.sold}</div>
          </div>

          <div className="h-px bg-[#F0F2F5]" />
          <div>
            <div className="text-[#676E76] text-sm font-medium flex items-center gap-2">
              Средняя цена <span className="text-emerald-500">↑ 9%</span>
            </div>
            <div className="text-4xl font-bold mt-2">
              {fmtMoney(totals.avgPrice)}
            </div>
          </div>

          <div className="h-px bg-[#F0F2F5]" />
          <div>
            <div className="text-[#676E76] text-sm font-medium flex items-center gap-2">
              Завершенные записи <span className="text-emerald-500">↑ 5%</span>
            </div>
            <div className="text-4xl font-bold mt-2">
              {totals.completedEnrollments.toLocaleString("en-US")}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[24px] font-semibold">Продажи</h3>
          </div>
          <div className="text-[28px] font-bold">
            {fmtMoney(totals.sumRevenue)}
          </div>

          <div className="w-full h-[320px] md:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} barCategoryGap={24}>
                <CartesianGrid vertical={false} stroke="#EEF1F4" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <YAxis
                  tickFormatter={axisMoneyK}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  formatter={(value: number) => [fmtMoney(value), "Выручка"]}
                  labelFormatter={(label) => `Месяц: ${label}`}
                  cursor={{ fill: "rgba(0,0,0,0.03)" }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  formatter={(val) => (val === 'revenue' ? 'Выручка' : 'Возврат')}
                  wrapperStyle={{ paddingBottom: 12 }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#EAECEF"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {studentsError ? (
        <div className="w-full bg-white rounded-[20px] p-6 text-red-500">
          Failed to load students.
        </div>
      ) : (
        <DashboardStudentsTable
          students={studentsData?.students ?? []}
        />
      )}
    </div>
  );
};

export default TeacherSalesPage;
