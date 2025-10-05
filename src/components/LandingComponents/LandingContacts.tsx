import Image from "next/image";

const LandingContacts = () => {
  return (
    <div className={'w-full h-full flex flex-col gap-16 p-20'}>
      <div className={'flex flex-col gap-6 items-center justify-center text-center'}>
        <p
          className={'text-[14px] leading-[22px] font-semibold text-white bg-gradient-tb rounded-full py-1 px-3'}>
          Свяжитесь с нами
        </p>
        <h1 className={'text-[54px] leading-[120%] font-semibold text-black'}>
          Мы всегда на связи
        </h1>
        <p className={'text-[20px] text-[#667085] leading-[30px]'}>
          Если у Вас возникли вопросы или предложения, мы готовы к диалогу. Напишите нам — мы будем рады помочь.
        </p>
      </div>
      <div className={'flex justify-center gap-3 flex-wrap'}>
        <div
          className={'bg-[#F6F7F9] flex flex-col gap-8 items-start justify-between p-6 rounded-[24px] w-[310px] h-[280px]'}>
          <div className={'flex flex-col gap-8'}>
            <Image src={'/salesDep.svg'} alt={'salesDep'} width={40} height={40}/>
            <div className={'flex flex-col gap-3'}>
              <h3 className={'text-[20px] font-semibold text-black leading-[120%]'}>
                Отдел продаж
              </h3>
              <p className={'text-[16px] leading-[24px] text-[#6E6E6E] line-clamp-2 h-12'}>
                Обратитесь к нашему дружелюбному коллективу
              </p>
            </div>
          </div>
          <p className={'text-[#EE7A67] text-[16px] leading-[24px] font-medium'}>
            sales@taxbilim.kz
          </p>
        </div>
        <div
          className={'bg-[#F6F7F9] flex flex-col gap-8 items-start justify-between p-6 rounded-[24px] w-[310px] h-[280px]'}>
          <div className={'flex flex-col gap-8'}>
            <Image src={'/group.svg'} alt={'group'} width={40} height={40}/>
            <div className={'flex flex-col gap-3'}>
              <h3 className={'text-[20px] font-semibold text-black leading-[120%]'}>
                Служба поддержки
              </h3>
              <p className={'text-[16px] leading-[24px] text-[#6E6E6E] line-clamp-2 h-12'}>
                Мы здесь, чтобы помочь
              </p>
            </div>
          </div>
          <p className={'text-[#EE7A67] text-[16px] leading-[24px] font-medium'}>
            support@taxbilim.kz
          </p>
        </div>
        <div
          className={'bg-[#F6F7F9] flex flex-col gap-8 items-start justify-between p-6 rounded-[24px] w-[310px] h-[280px]'}>
          <div className={'flex flex-col gap-8'}>
            <Image src={'/location.svg'} alt={'location'} width={40} height={40}/>
            <div className={'flex flex-col gap-3'}>
              <h3 className={'text-[20px] font-semibold text-black leading-[120%]'}>
                Посетите нас
              </h3>
              <p className={'text-[16px] leading-[24px] text-[#6E6E6E] line-clamp-2 h-12'}>
                Посетите наш офис
              </p>
            </div>
          </div>
          <p className={'text-[#EE7A67] text-[16px] leading-[24px] font-medium tracking-normal'}>
            100 Смит-стрит <br/>
            Коллингвуд ВИК 3066 Австралия
          </p>
        </div>
        <div
          className={'bg-[#F6F7F9] flex flex-col gap-8 items-start justify-between p-6 rounded-[24px] w-[310px] h-[280px]'}>
          <div className={'flex flex-col gap-8'}>
            <Image src={'/call.svg'} alt={'call'} width={40} height={40}/>
            <div className={'flex flex-col gap-3'}>
              <h3 className={'text-[20px] font-semibold text-black leading-[120%]'}>
                Позвоните нам
              </h3>
              <p className={'text-[16px] leading-[24px] text-[#6E6E6E] line-clamp-2 h-12'}>
                Пн-Пт с 8:00 до 17:00
              </p>
            </div>
          </div>
          <p className={'text-[#EE7A67] text-[16px] leading-[24px] font-medium'}>
            +1 (555) 000-0000
          </p>
        </div>
      </div>

    </div>
  );
};

export default LandingContacts;