import Image from "next/image";
import {Icon} from "@iconify/react";
import {Certificate} from "@/types/certificate";

interface CertificateCardProps {
  certificate: Certificate;
}
const CertificateCard = ({certificate}:CertificateCardProps) => {
  return (
    <div className={'flex flex-col p-5 rounded-[1rem] gap-6 items-center w-full bg-white min-w-[350px]'}>
      <div className="relative w-full aspect-video rounded-[0.5rem] overflow-hidden">
        <Image
          src="/certificateCard.png" alt="" fill className={"object-cover"}/>
      </div>
      <div className={'flex flex-col gap-3 w-full'}>
        <div className={'flex items-center justify-between gap-2'}>
          <div className={'flex items-center gap-3'}>
            <Image src={'/avatars.png'} alt={''} width={32} height={32} className={'rounded-full'}/>
            <p className={'text-[1rem] text-black font-medium'}>Лана Б.</p>
          </div>
          <div className={'flex items-center gap-1 bg-[#F6F7F9] px-2 py-1 rounded-[1rem]'}>
            <Icon icon={'heroicons:document-check-solid'} className={'text-black w-[18px] h-[18px]'}/>
            <p className={'text-black text-[12px] font-medium'}>{certificate.category}</p>
          </div>
        </div>
        <h2 className={'text-black text-[20px] font-semibold'}>
          {certificate.courseTitle}
        </h2>
        <p className={'text-[14px] text-[#676E76] font-medium'}>
          Дата получения:
          <span className={'text-black font-semibold'}> 20.01.2024</span>
        </p>
      </div>
      <button className={'text-black px-5 py-3 w-full rounded-[0.5rem] text-[14px] font-semibold shadow border border-[#9EA5AD]'}>
        Посмотреть
      </button>
    </div>
  );
};

export default CertificateCard;