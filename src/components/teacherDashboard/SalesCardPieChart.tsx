import {TopCourse} from "@/types/sales";
import {useState} from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Cell, Pie, PieChart} from "recharts";

type SalesCardPieChartProps = {
  topCourses: TopCourse[];
};
const PIE_COLORS = [
  "#EE7A67",
  "#3B82F6",
  "#6EE7B7",
  "#4B5563",
  "#F59E0B",
  "#10B981",
];

const SalesCardPieChart = ({ topCourses }: SalesCardPieChartProps) => {
  const [course, setCourse] = useState("all")
  const [period, setPeriod] = useState("thisMonth")

  const pieData = (topCourses ?? []).map((course) => ({
    name: course.title,
    value: course.revenue, // можно поменять на enrollments, если хочешь "по количеству"
  }));

  const pieConfig: ChartConfig = Object.fromEntries(
    pieData.map((item, index) => [
      item.name,
      {
        label: item.name,
        color: PIE_COLORS[index % PIE_COLORS.length],
      },
    ])
  ) as ChartConfig;

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

export default SalesCardPieChart;
