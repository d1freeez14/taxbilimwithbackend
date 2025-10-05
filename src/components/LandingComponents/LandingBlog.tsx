import Image from "next/image";

const LandingBlog = () => {
  return (
    <div className={'w-full h-full p-20 flex flex-col items-center justify-center gap-16 bg-gradient-tb'}>
      <div className={'flex flex-col gap-1 items-center justify-center'}>
        <p className={'text-[16px] text-white font-semibold leading-[26px]'}>Блог</p>
        <h1 className={'text-[54px] leading-[120%] text-white font-semibold text-center'}>
          Читайте наш блог и будьте в курсе всех обновлении
        </h1>
      </div>
      <div className={'flex gap-8 justify-center'}>
        <div className={'flex flex-col gap-8 p-6 bg-black rounded-[24px] w-[405px]'}>
          <Image src={'/imagePlaceholder.png'} alt={'imagePlaceholder'} width={350} height={200}
                 className={'object-contain rounded-[16px]'}/>
          <div className={'flex flex-col gap-4'}>
            <p className={'text-[14px] leading-[22px] text-white'}>12 октября 2024 г.</p>
            <p className={'text-[20px] leading-[28px] text-white font-semibold h-[84px] line-clamp-3'}>
              Образовательные курсы по налогам: ваш путь к финансовой грамотности
            </p>
            <div className={'flex items-center gap-4'}>
              <Image src={'/authorsImg.png'} alt={"authorsImg"} width={40} height={40}
                     className={'object-contain rounded-full'}/>
              <p className={'text-[14px] leading-[22px] text-white'}>Габриэль Вальдивия</p>
            </div>
            <div className={'flex items-center gap-1 flex-wrap'}>
              <p
                className={'text-[14px] leading-[22px] font-semibold text-black bg-[#E5E7EA] rounded-full py-1 px-3'}>
                Terraform
              </p>
              <p
                className={'text-[14px] leading-[22px] font-semibold text-black bg-[#E5E7EA] rounded-full py-1 px-3'}>
                AWS
              </p>
            </div>
          </div>
        </div>
        <div className={'flex flex-col gap-8 p-6 bg-black rounded-[24px] w-[405px]'}>
          <Image src={'/imagePlaceholder.png'} alt={'imagePlaceholder'} width={350} height={200}
                 className={'object-contain rounded-[16px]'}/>
          <div className={'flex flex-col gap-4'}>
            <p className={'text-[14px] leading-[22px] text-white'}>12 октября 2024 г.</p>
            <p className={'text-[20px] leading-[28px] text-white font-semibold h-[84px] line-clamp-3'}>
              Как образовательные курсы по налогам могут изменить вашу карьеру
            </p>
            <div className={'flex items-center gap-4'}>
              <Image src={'/authorsImg.png'} alt={"authorsImg"} width={40} height={40}
                     className={'object-contain rounded-full'}/>
              <p className={'text-[14px] leading-[22px] text-white'}>Габриэль Вальдивия</p>
            </div>
            <div className={'flex items-center gap-1 flex-wrap'}>
              <p
                className={'text-[14px] leading-[22px] font-semibold text-black bg-[#E5E7EA] rounded-full py-1 px-3'}>
                Terraform
              </p>
              <p
                className={'text-[14px] leading-[22px] font-semibold text-black bg-[#E5E7EA] rounded-full py-1 px-3'}>
                AWS
              </p>
            </div>
          </div>
        </div>
        <div className={'flex flex-col gap-8 p-6 bg-black rounded-[24px] w-[405px]'}>
          <Image src={'/imagePlaceholder.png'} alt={'imagePlaceholder'} width={350} height={200}
                 className={'object-contain rounded-[16px]'}/>
          <div className={'flex flex-col gap-4'}>
            <p className={'text-[14px] leading-[22px] text-white'}>12 октября 2024 г.</p>
            <p className={'text-[20px] leading-[28px] text-white font-semibold h-[84px] line-clamp-3'}>
              Налоги для всех: лучшие курсы для изучения налогового законодательства
            </p>
            <div className={'flex items-center gap-4'}>
              <Image src={'/authorsImg.png'} alt={"authorsImg"} width={40} height={40}
                     className={'object-contain rounded-full'}/>
              <p className={'text-[14px] leading-[22px] text-white'}>Габриэль Вальдивия</p>
            </div>
            <div className={'flex items-center gap-1 flex-wrap'}>
              <p
                className={'text-[14px] leading-[22px] font-semibold text-black bg-[#E5E7EA] rounded-full py-1 px-3'}>
                Terraform
              </p>
              <p
                className={'text-[14px] leading-[22px] font-semibold text-black bg-[#E5E7EA] rounded-full py-1 px-3'}>
                AWS
              </p>
            </div>
          </div>
        </div>
      </div>
      <button
        className={'px-7 py-3 text-[16px] leading-[28px] font-semibold bg-white rounded-[40px] text-black'}>
        Читать блог
      </button>
    </div>
  );
};

export default LandingBlog;