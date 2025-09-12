"use client";

import {BarChart, List} from "lucide-react";
import {usePathname} from "next/navigation";
import {SidebarItem} from "./sidebar-item";
import {guestRoutes} from "@/shared/routes";


const teacherRoutes = [
  {
    icon: '',
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: '',
    label: "Analytics",
    href: "/teacher/analytics",
  },
]

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full gap-2">
      <h3 className={'text-[#596066] text-[14px] font-semibold px-4'}>Навигация</h3>
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}