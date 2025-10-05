import Image from "next/image";

const LandingAdv = () => {
  return (
    <div className={'w-full h-[70vh] bg-gradient-gb flex gap-16 pt-20'}>
      <div className={'w-[50%] flex flex-col gap-8 items-start pl-20 pt-20'}>
        <Image src={'/taxkomekWhite.svg'} alt={'taxKomekWhite'} width={165} height={28}/>
        <div className={'flex flex-col gap-6'}>
          <h2 className={'text-[51px] text-white font-semibold tracking-tight leading-[110%]'}>
            Найти налогового эксперта теперь - легко и быстро
          </h2>
          <p className={'text-[20px] text-white leading-[140%]'}>
            Создавайте услуги, управляйте и анализируйте свои налоговые операции легко и эффективно.
          </p>
        </div>
        <button className={'px-7 py-3 text-[16px] text-black font-semibold leading-[28px] bg-white rounded-[40px]'}>
          Начать бесплатно
        </button>
      </div>
      <div
        className={'w-[50%] relative border-t-[8px] border-l-[8px] border-[#676E76] rounded-tl-[24px] overflow-hidden'}>
        <Image src={'/loginImage2.png'} alt={'taxBilimInterface'} fill
               className={'object-cover object-left-top'}/>
      </div>
    </div>
  );
};

export default LandingAdv;