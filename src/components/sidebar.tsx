import {Logo} from "./logo"
import {SidebarRoutes} from "./sidebar-routes"
import Image from "next/image";
import {IconLanguage} from "@/shared/icons/IconLanguage";
import {IconSettings} from "@/shared/icons/IconSettings";
import {Icon} from "@iconify/react";

export const Sidebar = () => {
  return (
    <div className="h-full flex flex-col justify-between gap-5 overflow-y-auto bg-white shadow-sm px-5 py-8">
      <div className="">
        <Logo/>
      </div>
      <hr className={'w-full border-[#E5E7EA]'}/>
      <div className="h-full flex flex-col w-full justify-between gap-6">
        <SidebarRoutes/>

        {/*-----ADVERTISEMENT-----*/}

        <div className={'relative w-full p-4 pb-14 rounded-[16px] flex flex-col gap-4 bg-[#EFFDF6] overflow-hidden'}>
          <Image src="/taxKomek.png" alt="taxKomek" width={140} height={24}/>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-[#596066] text-[12px] font-medium'}>CTA</p>
            <h2 className={'text-[24px] text-black font-semibold'}>Рекламный слоган</h2>
          </div>
          <div className={'absolute bottom-[-50px] right-[-50px]'}>
            <Image src="/advImage.png" alt="advImage" width={160} height={160}/>
          </div>
        </div>

        {/*-----SIDEBAR FOOTER-----*/}
        <div className={'flex flex-col gap-2'}>
          <p className={'text-[14px] text-[#596066] font-semibold px-4'}>Аккаунт</p>
          <div className={'flex flex-col gap-1'}>
            <div className={'flex gap-2 text-[#676E76] font-medium px-4 py-3.5'}>
              <Icon icon={'famicons:language-outline'} className={`w-[18px] h-[18px] text-[#676E76]`}/>
              <p className={'text-[14px]'}>Язык</p>
            </div>
            <div className={'flex gap-2 text-[#676E76] font-medium px-4 py-3.5'}>
              <Icon icon={'uil:setting'} className={`w-[18px] h-[18px] text-[#676E76]`}/>
              <p className={'text-[14px]'}>Настройки</p>
            </div>
            <div className={'flex gap-2 text-[#676E76] font-medium px-4 py-3.5'}>
              <Icon icon={'lucide:message-circle-question-mark'} className={`w-[18px] h-[18px] text-[#676E76]`}/>
              <p className={'text-[14px]'}>Служба поддержки</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}