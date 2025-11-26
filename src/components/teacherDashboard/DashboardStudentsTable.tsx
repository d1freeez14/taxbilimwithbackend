import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Student} from "@/types/student";

interface DashboardStudentsTableProps {
  students: Student[];
}

const DashboardStudentsTable = ({students}: DashboardStudentsTableProps) => {

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('ru-RU') : '-';

  const formatPrice = (price?: number) =>
    typeof price === 'number' ? `${price.toLocaleString('ru-RU')} ₸` : '-';

  const statusClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[#F0FDF4] text-[#22C55E]'; // green
      case 'active':
        return 'bg-[#FEFCE8] text-[#EAB308]'; // yellow
      case 'canceled':
        return 'bg-[#FEF2F2] text-[#EF4444]'; // red
      case 'expired':
        return 'bg-[#F3F4F6] text-[#6B7280]'; // gray
      default:
        return 'bg-[#EEF2FF] text-[#4F46E5]'; // fallback
    }
  };

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
              <TableRow key={s.id} className="text-[16px] font-medium align-top">
                {/* № заказа — показываю id студента; подставь свой order/enrollment id при наличии */}
                <TableCell className="font-medium">{s.id}</TableCell>

                {/* Имя студента */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={s.avatar ?? '/avatars.png'}
                      alt={s.name}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    {s.name}
                  </div>
                </TableCell>

                {/* Дата (стек из enrolled_at по курсам) */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {s.courses?.map((c) => (
                      <span key={`date-${c.id}`}>{formatDate(c.enrolled_at)}</span>
                    ))}
                  </div>
                </TableCell>

                {/* Название курса (стек) */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {s.courses?.map((c) => (
                      <div key={`title-${c.id}`} className="flex items-center gap-2">
                        {c.title}
                      </div>
                    ))}
                  </div>
                </TableCell>

                {/* Цена (стек) */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {s.courses?.map((c) => (
                      <span key={`price-${c.id}`}>{formatPrice(c.price)}</span>
                    ))}
                  </div>
                </TableCell>

                {/* Статус (стек) */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {s.courses?.map((c) => (
                      <Badge
                        key={`status-${c.id}`}
                        variant="outline"
                        className={`${statusClasses(String(c.status))} rounded-[4px] border-none text-[12px] font-medium w-fit`}
                      >
                        {String(c.status)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {(students.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm py-10 text-gray-500">
                  Нет данных по студентам или курсам.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}


export default DashboardStudentsTable;
