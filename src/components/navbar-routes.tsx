"use client";
import { usePathname } from "next/navigation";
import {IconChat} from "@/shared/icons/IconChat";
import {IconNotifications} from "@/shared/icons/IconNotifications";
import {IconMore} from "@/shared/icons/IconMore";
import Image from "next/image";
import {guestRoutes} from "@/shared/routes";
import {useSession} from "@/lib/useSession";

export const NavbarRoutes = () => {
  const {getSession} = useSession();
  const session = getSession();

  const pathname = usePathname();
  const currentGuest = guestRoutes.find(route => route.href === pathname);
  const title = currentGuest?.label ?? '';

  return (
    <div className={'w-full flex justify-between items-center gap-1 px-10 py-5'}>
      <h1 className={'text-[30px] font-semibold'}>{title}</h1>
      <div className={'flex items-center gap-3'}>
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