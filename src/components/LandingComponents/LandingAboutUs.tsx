import Image from "next/image";

const LandingAboutUs = () => {
  return (
    <div className={'w-full h-full bg-gradient-tb px-20 py-[108px] flex flex-col gap-16 overflow-y-hidden'}>
      <div className={'flex flex-col gap-1 justify-center items-center'}>
        <p className={'text-[16px] font-semibold text-white leading-[26px]'}>О нас</p>
        <h1 className={'text-[54px] font-semibold text-white leading-[120%] text-center w-[70%]'}>
          Мы открываем путь к новым знаниям и карьерным достижениям
        </h1>
      </div>
      <div className={'flex gap-3 flex-1'}>
        <div className={'flex flex-col gap-3 flex-[0.4]'}>
          <div className={'flex flex-col gap-8 p-6 bg-black rounded-[24px] border border-black border-opacity-5'}>
            <Image src={'/relevantCourses.svg'} alt={'relevantCourses'} width={40} height={40}/>
            <div className={'flex flex-col gap-3'}>
              <h3 className={'text-[20px] font-semibold text-white leading-[120%]'}>Актуальные курсы</h3>
              <p className={'text-[16px] text-[#A7A7A7] leading-[24px]'}>
                Все программы соответствуют современным требованиям и регулярно обновляются в соответствии с изменениями
                в законодательстве.
              </p>
            </div>
          </div>
          <div className={'flex flex-col gap-8 p-6 bg-black rounded-[24px] border border-black border-opacity-5'}>
            <Image src={'/timeFormat.svg'} alt={'timeFormat'} width={40} height={40}/>
            <div className={'flex flex-col gap-3'}>
              <h3 className={'text-[20px] font-semibold text-white leading-[120%]'}>Гибкий формат обучения</h3>
              <p className={'text-[16px] text-[#A7A7A7] leading-[24px]'}>
                Учитесь онлайн в удобное время и в удобном темпе. Доступ к материалам остаётся за вами.
              </p>
            </div>
          </div>
          <div className={'flex flex-col gap-8 p-6 bg-black rounded-[24px] border border-black border-opacity-5'}>
            <Image src={'/certificates.svg'} alt={'certificates'} width={40} height={40}/>
            <div className={'flex flex-col gap-3'}>
              <h3 className={'text-[20px] font-semibold text-white leading-[120%]'}>Сертификаты, которые ценят</h3>
              <p className={'text-[16px] text-[#A7A7A7] leading-[24px]'}>
                После завершения курсов вы получаете официальный сертификат, подтверждающий вашу квалификацию.
              </p>
            </div>
          </div>
        </div>
        <div
          className={'flex flex-col gap-10 flex-[0.6] p-8 bg-black rounded-[24px] border border-black border-opacity-5'}>
          <Image src={'/kubikRubik.svg'} alt={'kubikRubik'} width={165} height={240}/>
          <div className={'flex flex-col gap-6'}>
            <h2 className={'text-[32px] font-semibold text-white leading-[120%]'}>
              TaxBilim объединяет лучшие образовательные курсы в сфере налогов
            </h2>
            <p className={'text-[20px] text-[#A7A7A7] leading-[140%]'}>
              Наши программы помогут вам повысить квалификацию, освоить новые навыки и подтвердить знания официальными
              сертификатами. Учитесь у экспертов и двигайтесь к профессиональному успеху.
            </p>
          </div>
          <div className={'flex items-center justify-between gap-16 py-4 px-6 bg-gradient-tb rounded-[20px] self-end'}>
            <div className={'flex items-center gap-4 flex-1'}>
              <Image src={'/usersHorizontal.png'} alt={'usersHorizontal'} width={104} height={48}/>
              <p className={'text-[16px] font-medium text-white leading-[24px]'}>
                Более 500 специалистов уже прошли обучение и получили сертификаты — присоединяйтесь!
              </p>
            </div>
            <Image src={'/chevronRight.svg'} alt={'chevronRight'} width={40} height={40}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingAboutUs;