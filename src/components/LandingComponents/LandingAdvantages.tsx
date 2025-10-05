import Image from "next/image";

const LandingAdvantages = () => {
  return (
    <div className={'w-full h-full flex flex-col bg-white'}>
      <div className={'flex items-center gap-16 flex-1 p-20'}>
        <div className={'w-full h-full flex justify-center items-center  rounded-[24px] flex-[0.55]'}>
          <Image src={'/CourseCard.png'} alt={'CourseCard'} width={655} height={477} className={'object-contain'}/>
        </div>
        <div className={'flex flex-col items-start gap-6 flex-[0.45]'}>
          <p className={'py-1 px-[14px] bg-[#E5E7EA] rounded-full text-[14px] text-black leading-[22px] font-semibold'}>
            Специалисты
          </p>
          <div className={'flex flex-col gap-8'}>
            <h1 className={'text-[54px] font-semibold leading-[120%] text-black'}>Лучшие курсы для вашего развития</h1>
            <p className={'text-[20px] text-[#6E6E6E] leading-[30px]'}>
              Мы собрали самые актуальные образовательные программы по налогам и смежным направлениям. Обучайтесь у
              опытных экспертов и получайте знания, которые ценятся на рынке.
            </p>
          </div>
          <button className={'text-white bg-[#EE7A67] py-3 px-7 rounded-full text-[16px] leading-[28px] font-semibold'}>
            Выбрать курс
          </button>
        </div>
      </div>
      <div className={'flex items-center flex-row-reverse gap-16 flex-1 p-20'}>
        <div className={'w-full h-full flex justify-center items-center rounded-[24px] flex-[0.55]'}>
          <Image src={'/LandingImg2.png'} alt={'CourseCard'} width={655} height={477} className={'object-contain'}/>
        </div>
        <div className={'flex flex-col items-start gap-6 flex-[0.45]'}>
          <p className={'py-1 px-[14px] bg-[#E5E7EA] rounded-full text-[14px] text-black leading-[22px] font-semibold'}>
            Документы
          </p>
          <div className={'flex flex-col gap-8'}>
            <h1 className={'text-[54px] font-semibold leading-[120%] text-black'}>Учитесь в удобном формате</h1>
            <p className={'text-[20px] text-[#6E6E6E] leading-[30px]'}>
              Онлайн-лекции, практические задания и тесты доступны в любое время. Проходите обучение в удобном темпе и
              получайте сертификаты, подтверждающие ваш уровень.
            </p>
          </div>
          <button className={'text-white bg-[#EE7A67] py-3 px-7 rounded-full text-[16px] leading-[28px] font-semibold'}>
            Начать обучение
          </button>
        </div>
      </div>
      <div className={'flex items-center gap-16 flex-1 p-20'}>
        <div className={'w-full h-full flex justify-center items-center  rounded-[24px] flex-[0.55]'}>
          <Image src={'/LandingImg3.png'} alt={'CourseCard'} width={655} height={477} className={'object-contain'}/>
        </div>
        <div className={'flex flex-col items-start gap-6 flex-[0.45]'}>
          <p className={'py-1 px-[14px] bg-[#E5E7EA] rounded-full text-[14px] text-black leading-[22px] font-semibold'}>
            Эксперты
          </p>
          <div className={'flex flex-col gap-8'}>
            <h1 className={'text-[54px] font-semibold leading-[120%] text-black'}>Ваши знания подтверждены
              официально</h1>
            <p className={'text-[20px] text-[#6E6E6E] leading-[30px]'}>
              После завершения курса вы получаете именной сертификат, который подтверждает ваш уровень знаний и навыков.
              Это не просто документ - это инвестиция в ваш карьерный рост и новые возможности.
            </p>
          </div>
          <button className={'text-white bg-[#EE7A67] py-3 px-7 rounded-full text-[16px] leading-[28px] font-semibold'}>
            Начать бесплатно
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingAdvantages;