import {MonthlyStat} from "@/types/sales";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {useMemo, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Icon} from "@iconify/react";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";

type SalesCardBarChartProps = {
  monthlyStats: MonthlyStat[];
};

const SalesCardBarChart = ({monthlyStats}:SalesCardBarChartProps) => {
  const [course, setCourse] = useState<string>("all")
  const [period, setPeriod] = useState<string>("thisMonth")

  const filteredMonthlyStats = useMemo(() => {
    if (!monthlyStats?.length) return [];

    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth(); // 0–11

    return monthlyStats.filter((item) => {
      const d = new Date(item.month);
      const year = d.getFullYear();
      const month = d.getMonth();

      switch (period) {
        case "thisMonth":
          return year === thisYear && month === thisMonth;

        case "lastMonth": {
          const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);
          const lastYear = lastMonthDate.getFullYear();
          const lastMonth = lastMonthDate.getMonth();
          return year === lastYear && month === lastMonth;
        }

        case "year":
          return year === thisYear;

        default:
          return true;
      }
    });
  }, [monthlyStats, period]);
  const data = filteredMonthlyStats.map((item) => ({
    month: new Date(item.month).toLocaleString("ru-RU", { month: "short" }),
    revenue: item.revenue,
    returns: 0,
  }));

  const chartConfig = {
    revenue: {label: "Выручка", color: "#EE7A67"},
    returns: {label: "Возврат", color: "#D1D5DB"},
  } satisfies ChartConfig

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
                <SelectItem value="thisMonth">Этот месяц</SelectItem>
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
            {total.toLocaleString()}₸
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
              tickFormatter={(val) => `${val}₸`}
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

export default SalesCardBarChart;
