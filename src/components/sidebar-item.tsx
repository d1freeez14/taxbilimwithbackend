"use client";

import {usePathname, useRouter} from "next/navigation";

import {cn} from "@/lib/utils";
import {Icon} from "@iconify/react";

interface SidebarItemProps {
  icon: string;
  label: string;
  href: string;
};

export const SidebarItem = ({
                              icon,
                              label,
                              href,
                            }: SidebarItemProps) => {

  const ROOTS = ["/dashboard", "/teacher/dashboard"];

  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    pathname === href || (!ROOTS.includes(href) && pathname.startsWith(href + "/"));

  const onClick = () => {
    router.push(href);
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center text-[#676E76] text-sm font-[500] px-4 py-3.5 transition-all rounded-[12px]",
        isActive(href) && "text-white bg-[#EE7A67]"
      )}
    >
      <div className="flex items-center gap-x-2">
        <Icon icon={icon} className={`w-[18px] h-[18px] ${isActive(href) ? 'text-white': 'text-[#676E76]'}`}/>
        <p className={'text-[14px] font-medium'}>
          {label}
        </p>
      </div>
    </button>
  )
}