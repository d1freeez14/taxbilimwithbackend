"use client";
import {usePathname, useRouter} from "next/navigation";
import {IconChat} from "@/shared/icons/IconChat";
import {IconNotifications} from "@/shared/icons/IconNotifications";
import {IconMore} from "@/shared/icons/IconMore";
import Image from "next/image";
import {guestRoutes} from "@/shared/routes";
import {useSession} from "@/lib/useSession";
import Link from "next/link";
import {Icon} from "@iconify/react";

export const NavbarRoutes = () => {
  const {session, ready} = useSession();

  const pathname = usePathname();
  const router = useRouter();
  const currentGuest = guestRoutes.find(route => route.href === pathname);
  const title = currentGuest?.label ?? '';

  const handleCreate = () => {
    router.push(`${pathname}/create`);
  };
  return (
    <div className={'w-full flex justify-between items-center gap-1 px-10 py-5'}>
      <h1 className={'text-[30px] font-semibold'}>{title}</h1>
      <div className={'flex items-center gap-3'}>
        {session?.user.role === "TEACHER" && pathname === '/teacher/courses' && (
          <button onClick={handleCreate}
                  className={'bg-[#EE7A67] flex items-center gap-3 text-white font-semibold text-[18px] px-6 py-4 rounded-full'}>
            <Icon icon={'typcn:plus'} className={'w-6 h-6'}/>
            Создать новый курс
          </button>
        )}
        <div className={'p-[15px] bg-white rounded-full text-black'}>
          <IconChat/>
        </div>
        <div className={'p-[15px] bg-white rounded-full text-black'}>
          <IconNotifications/>
        </div>
        <div className={'flex items-center gap-2 p-2 bg-white rounded-full'}>
          <Image src={'/avatars.png'} alt={'avatar'} width={48} height={48}/>
          <div className={'flex flex-col gap-1'}>
            <h2 className={'text-[16px] font-semibold'}>{session?.user.name}</h2>
            <p className={'text-[12px] font-medium text-[#676E76]'}>{session?.user.email}</p>
          </div>
          <button>
            <IconMore/>
          </button>
        </div>
      </div>
    </div>
  )
}
