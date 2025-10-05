import Image from "next/image";

const LandingMain = () => {
  return (
    <div id={'main'} className={'w-full h-screen px-20 flex flex-col gap-16'}>
      {/*HEADER*/}
      <div className={'flex justify-between gap-4 py-[18px]'}>
        <div className={'flex items-center gap-14'}>
          <Image src={'/taxBilim.png'} alt={'TaxBilim'} width={120} height={24}/>
          <div className={'flex items-center gap-10'}>
            <a href={'#main'} className={'text-black font-semibold text-[14px]'}>Главная</a>
            <a href={''} className={'text-black font-semibold text-[14px]'}>О нас</a>
            <a href={''} className={'text-black font-semibold text-[14px]'}>Преимущества</a>
            <a href={''} className={'text-black font-semibold text-[14px]'}>FAQ</a>
            <a href={''} className={'text-black font-semibold text-[14px]'}>Блог</a>
            <a href={''} className={'text-black font-semibold text-[14px]'}>Контакты</a>
          </div>
        </div>
        <div className={'flex items-center gap-5'}>
          <a href={'/login'} className={'text-black font-semibold text-[14px] hover:underline'}>Войти</a>
          <a href={'/register'}
             className={'px-5 py-2.5 bg-[#EE7A67] rounded-[40px] text-white text-[14px] font-semibold shadow-inner-white'}>
            Регистрация
          </a>
        </div>
      </div>
      {/*MAIN PART*/}
      <div className={'flex flex-col flex-1 gap-16 pt-4'}>
        <div className={'flex flex-col gap-6 justify-center items-center'}>
          <h1 className={'text-[72px] font-semibold text-black leading-[120%] text-center'}>
            Начните обучение сегодня и станьте экспертом завтрашнего дня
          </h1>
          <p className={'text-[#5F5F5F] text-[20px] leading-[30px] text-center w-[50%]'}>
            Надёжный проводник в мире налогового образования. Запишитесь на курсы и уверенно управляйте своими
            финансами.
          </p>
          <button
            className={'mt-6 px-7 py-3 bg-[#EE7A67] rounded-[40px] text-white text-[16px] leading-[28px] font-semibold shadow-inner-white'}>
            Начать обучение бесплатно
          </button>
        </div>
        <div className="relative flex-1 min-h-0 border-t-[8px] border-x-[8px] border-black rounded-t-[12px]">
          <Image
            src="/taxBilimInterface.png"
            alt="TaxBilimInterface"
            fill
            className="object-cover object-top" // shows full image within the area
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default LandingMain;