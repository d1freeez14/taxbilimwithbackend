'use client'
import {Icon} from "@iconify/react";
import Image from "next/image";
import lessons from '@/static/lessons.json'
import {useParams} from "next/navigation";
const LessonPageById = () => {
  const { lessonId } = useParams();
  const id = Array.isArray(lessonId) ? lessonId[0] : lessonId
  const lessonById = lessons[parseInt(id)];
  console.log('lessonById', lessonById)
  return (
    <div className={'w-full h-full flex gap-8 items-start'}>
      <div className={'bg-white p-6 flex flex-col gap-8 rounded-[20px]'}>
        {/*HEADER*/}
        <div className={'flex items-center justify-between gap-4'}>
          <div className={'flex items-center gap-4'}>
            <Icon icon={'material-symbols-light:chevron-left'} className={'w-8 h-8 p-0 text-[#676E76]'}/>
            <h1 className={'text-black text-[30px] font-semibold'}>1.4 Название</h1>
          </div>
          <div className={'flex items-center gap-3'}>
            <button
              className={'flex items-center justify-center p-2 border border-[#676E76] border-opacity-20 rounded-full'}>
              <Icon icon={'material-symbols-light:chevron-left'} className={'w-6 h-6 text-[#676E76]'}/>
            </button>
            <button
              className={'flex items-center justify-center p-2 border border-[#676E76] border-opacity-20 rounded-full'}>
              <Icon icon={'material-symbols-light:chevron-right'} className={'w-6 h-6 text-[#676E76]'}/>
            </button>
          </div>
        </div>
        {/*VIDEO*/}
        <div className={'relative w-full aspect-video '}>
          <Image src={'/courseVideo.png'} alt={''} fill objectFit={'cover'}/>
        </div>
        {/*DESCRIPTION*/}
        <div className={'flex flex-col gap-6'}>
          <h2 className={'text-black text-[24px] font-semibold'}>Описание</h2>
          <p className={'text-[#383F45] text-[14px]'}>
            Lorem ipsum dolor sit amet consectetur. Convallis pulvinar mattis integer tincidunt integer bibendum integer
            in. Nisl eu dui facilisi sit tristique pretium in. Metus lectus semper odio sit consectetur nibh. Non ac
            euismod nunc quam etiam. Nam massa cursus non quam turpis molestie sed sem. In ullamcorper vel aenean
            gravida pretium dui fringilla. Convallis eget tortor nunc massa.
            Sed magna in orci amet vulputate integer pharetra ipsum cum. Consectetur vivamus pellentesque aliquet nulla
            maecenas donec arcu eu ut. Fames dictum cum nullam adipiscing eget ipsum nunc. Euismod odio magna lectus
            imperdiet enim. Pellentesque ut facilisi quis a sit accumsan. Tellus aliquet purus diam eget pulvinar nibh.
            Nunc id nibh elit cursus volutpat amet ultrices. Vestibulum neque et in lacus elit volutpat. Hac elit
            dictumst orci proin dictum feugiat. In ultrices augue adipiscing diam laoreet fermentum vitae. Amet lacus
            bibendum ornare eu eget id rutrum sit. Elementum eget at dictum lorem. Nulla sodales et egestas pharetra sem
            et condimentum lacus vitae. Aliquam volutpat fermentum scelerisque morbi blandit lectus diam in
            pellentesque.
            A et sit phasellus laoreet quisque. Mauris mauris enim adipiscing blandit elit etiam lobortis luctus
            vehicula. Ac tortor metus diam quam cursus nam sed ultrices. Morbi lectus a sed augue. Curabitur morbi nam
            tellus euismod sed ipsum amet bibendum luctus. Velit aliquet dolor dolor pellentesque vel facilisis.
            Est habitasse magna cursus purus posuere faucibus blandit enim maecenas. Nulla adipiscing convallis.
          </p>
        </div>
        <hr className={'border-t border-[#E5E7EA]'}/>
        {/*MATERIALS*/}
        <div className={'flex flex-col gap-6'}>
          <h2 className={'text-black text-[24px] font-semibold'}>Материалы</h2>
          <div className={'flex flex-col gap-2'}>
            <div className={'flex items-center justify-between gap-4 p-3 bg-[#FAFAFA] rounded-[16px]'}>
              <div className={'flex items-center gap-3'}>
                <Icon icon={'basil:document-solid'}
                      className={'w-10 h-10 p-1.5 bg-[#FEF2F2] text-[#EE7A67] rounded-[8px]'}/>
                <p className={'text-black text-[16px] font-medium'}>Налоговые консультации.pdf</p>
              </div>
              <button
                className={'flex items-center gap-2 px-5 py-3 bg-[#EE7A67] text-white text-[14px] font-semibold rounded-[8px]'}>
                Скачать
                <Icon icon={'hugeicons:download-01'} className={'w-[18px] h-[18px]'}/>
              </button>
            </div>
            <div className={'flex items-center justify-between gap-4 p-3 bg-[#FAFAFA] rounded-[16px]'}>
              <div className={'flex items-center gap-3'}>
                <Icon icon={'basil:document-solid'}
                      className={'w-10 h-10 p-1.5 bg-[#FEF2F2] text-[#EE7A67] rounded-[8px]'}/>
                <p className={'text-black text-[16px] font-medium'}>Налоговые консультации.pdf</p>
              </div>
              <button
                className={'flex items-center gap-2 px-5 py-3 bg-[#EE7A67] text-white text-[14px] font-semibold rounded-[8px]'}>
                Скачать
                <Icon icon={'hugeicons:download-01'} className={'w-[18px] h-[18px]'}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPageById;