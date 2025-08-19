import Image from "next/image";
import {Icon} from "@iconify/react";

const ChatComponent = () => {
  return (
    <div className={'bg-white flex flex-col border border-[#E5E7EA] rounded-[16px] overflow-hidden'}>
      <div className={'bg-[#FAFAFA] p-6'}>
        <h2 className={'text-[24px] font-semibold text-black'}>Внутренние сообщения</h2>
      </div>
      {/*MESSAGES*/}
      <div className={'max-h-96 flex flex-col gap-2 w-full px-4 py-3 overflow-y-scroll'}>
        {/*OTHER MESSAGES*/}
        <div className={'flex gap-2 items-end max-w-[90%]'}>
          <Image src={'/avatars.png'} alt={''} width={40} height={40} className={'rounded-full object-cover'}/>
          <div className={'flex flex-col gap-2 py-2 px-3 bg-[#F6F7F9] rounded-[12px]'}>
            <h2 className={'text-[#008D9B] text-[14px] font-semibold'}>Азамат А.</h2>
            <p className={'text-[12px] font-medium text-black'}>
              Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis
            </p>
            <div className={'flex items-center gap-1'}>
              <Icon icon={'solar:check-read-broken'} className={'text-[#53B483] w-4 h-4'}/>
              <p className={'text-[#454C52] text-[12px] font-medium'}>2 m Ago</p>
            </div>
          </div>
        </div>
        {/*MY MESSAGES*/}
        <div className={'flex flex-col gap-2 py-2 px-3 bg-[#676E76] rounded-[12px] max-w-[90%] self-end'}>
          <h2 className={'text-white text-[14px] font-semibold'}>Вы</h2>
          <p className={'text-[12px] font-medium text-[#E5E7EA]'}>
            Et harum quidem rerum facilis est
          </p>
          <div className={'flex items-center gap-1 self-end'}>
            <Icon icon={'solar:check-read-broken'} className={'text-white w-4 h-4'}/>
            <p className={'text-[#E5E7EA] text-[12px] font-medium'}>2 m Ago</p>
          </div>
        </div>
      </div>
      {/*INPUT*/}
      <div className={'w-full p-4 bg-[#FAFAFA]'}>
        <div className={'bg-white p-2 flex justify-between gap-2 border border-[#E5E7EA] rounded-[12px]'}>
          <input type={'text'} placeholder={'Отправьте сообщение...'} className={'text-[14px]'}/>
          <div className={'flex items-center gap-3'}>
            <button className={'border-none'}>
              <Icon icon={'hugeicons:attachment-circle'} className={'-rotate-90 text-[#9C9CA4] w-6 h-6'}/>
            </button>
            <button className={'bg-[#EE7A67] text-white rounded-[10px] p-2.5'}>
              <Icon icon={'mingcute:send-fill'} className={'w-6 h-6'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;