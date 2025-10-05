import Image from "next/image";

const LandingFooter = () => {
  return (
    <div className={'w-full h-full flex flex-col gap-8 px-20 py-12 bg-[#1A1D1F]'}>
      <div className={'flex justify-between gap-5'}>
        <div className={'flex flex-col gap-8'}>
          <div className={'flex flex-col gap-4'}>
            <Image src={'/taxBilim.png'} alt={"taxBilim"} width={120} height={24}/>
            <p className={'text-[18px] leading-[24px] font-semibold text-white'}>
              Найти налогового эксперта теперь - легко и быстро!
            </p>
          </div>
          <div className={'flex items-center gap-8'}>
            <p className={'text-[18px] text-[#9EA5AD] leading-[22px]'}>Главная</p>
            <p className={'text-[18px] text-[#9EA5AD] leading-[22px]'}>О нас</p>
            <p className={'text-[18px] text-[#9EA5AD] leading-[22px]'}>Преимущества</p>
            <p className={'text-[18px] text-[#9EA5AD] leading-[22px]'}>FAQ</p>
            <p className={'text-[18px] text-[#9EA5AD] leading-[22px]'}>Блог</p>
            <p className={'text-[18px] text-[#9EA5AD] leading-[22px]'}>Контакты</p>
          </div>
        </div>
        <div className={'flex flex-col items-end gap-4'}>
          <p className={'text-[18px] text-[#CED2D6] leading-[24px] w-[60%] text-end'}>Следи за нами в социальных
            сетях</p>
          <div className={'flex items-center gap-6'}>
            <Image src={'/linkedin.svg'} alt={'linkedin'} width={24} height={24}/>
            <Image src={'/facebook.svg'} alt={'facebook'} width={24} height={24}/>
          </div>
        </div>
      </div>
      <div className={'flex items-center gap-8 border-t-[#5F698033] border-t pt-8'}>
        <p className={'text-[14px] text-[#9EA5AD] leading-[22px]'}>© 2024 TaxKomek. Все права защищены.</p>
        <p className={'text-[14px] text-[#9EA5AD] leading-[22px]'}>Политика конфиденциальности</p>
      </div>
    </div>
  );
};

export default LandingFooter;