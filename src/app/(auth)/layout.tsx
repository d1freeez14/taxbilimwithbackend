'use client'
import Image from "next/image";
import TextSlider from "@/components/TextSlider";
import {Icon} from "@iconify/react";

const AuthLayout = ({
                      children
                    }: {
  children: React.ReactNode
}) => {
  return (
    <div className="w-screen h-screen bg-[#E5E7EA] flex items-stretch gap-5 p-5">
      {/*LEFT*/}
      <div className={'w-[50%] h-full bg-[#676E76] flex flex-col gap-6 pl-16 py-16 rounded-[20px] justify-between'}>
        <Image src={'/taxBilimWhite.png'} alt={''} width={140} height={28}/>
        <div className="relative w-full flex-1 overflow-hidden bg-[#676E76] rounded-l-[16px]">
          {/* full-bleed, top-cropped image */}
          <Image
            src="/loginImage2.png"
            alt="App preview"
            fill
            className="object-cover object-left-top pl-[1px] pb-[1px] rounded-l-[16px]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* gradient fade at bottom */}
          <div className="absolute inset-0 rounded-l-[16px] bg-gradient-to-t from-[#676E76] to-transparent" />
        </div>
        <div className={'pr-16'}>
          <TextSlider/>
        </div>
      </div>
      {/*RIGHT*/}
      <div className={'w-[50%] h-full bg-white rounded-[20px] flex flex-col gap-5 items-center justify-between'}>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;