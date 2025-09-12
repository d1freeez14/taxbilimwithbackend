'use client'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

const MainSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <Slider
      dots={true}
      fade={true}
      infinite={true}
      speed={1000}
      slidesToShow={1}
      slidesToScroll={1}
      waitForAnimate={false}
      autoplay={true}
      arrows={false}
    >
      <div className={'w-full flex flex-col p-6 pb-8 bg-[#676E76] rounded-[16px] space-y-6 relative'}>
        <div className={'flex flex-col gap-2'}>
          <h2 className={'text-[1.5rem] text-white font-semibold'}>Новые курсы о налогах по 25% скидке</h2>
          <p className={'text-[0.875rem] text-[#E5E7EA] font-medium'}>
            Успей попасть на набор и получи безлимитный доступ на курс
          </p>
        </div>
        <button className={'bg-white px-4 py-2 flex items-center gap-2 rounded-[0.5rem]'}>
          <p className={'text-black text-[0.875rem] font-medium'}>Записаться на курс</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18" fill="none">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M7.14863 13.1892C6.90604 12.9952 6.86671 12.6412 7.06078 12.3986L9.77967 8.99998L7.06078 5.60137C6.86671 5.35878 6.90604 5.00481 7.14863 4.81074C7.39121 4.61667 7.74519 4.656 7.93926 4.89859L10.9393 8.64859C11.1036 8.85402 11.1036 9.14593 10.9393 9.35137L7.93926 13.1014C7.74519 13.344 7.39121 13.3833 7.14863 13.1892Z"
                  fill="black"/>
          </svg>
        </button>
        <div className={'absolute bottom-0 right-0'}>
          <Image src={'/sliderImage.png'} alt={""} width={180} height={150}/>
        </div>
      </div>
      {/*<div className={'w-full flex flex-col p-6 pb-8 bg-[#676E76] rounded-[16px] space-y-6'}>*/}
      {/*  <div className={'flex flex-col gap-2'}>*/}
      {/*    <h2 className={'text-[1.5rem] text-white font-semibold'}>Новые курсы о налогах по 25% скидке</h2>*/}
      {/*    <p className={'text-[0.875rem] text-[#E5E7EA] font-medium'}>*/}
      {/*      Успей попасть на набор и получи безлимитный доступ на курс*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*  <button className={'bg-white px-4 py-2 flex items-center gap-2 rounded-[0.5rem]'}>*/}
      {/*    <p className={'text-black text-[0.875rem] font-medium'}>Записаться на курс</p>*/}
      {/*    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18" fill="none">*/}
      {/*      <path fill-rule="evenodd" clipRule="evenodd"*/}
      {/*            d="M7.14863 13.1892C6.90604 12.9952 6.86671 12.6412 7.06078 12.3986L9.77967 8.99998L7.06078 5.60137C6.86671 5.35878 6.90604 5.00481 7.14863 4.81074C7.39121 4.61667 7.74519 4.656 7.93926 4.89859L10.9393 8.64859C11.1036 8.85402 11.1036 9.14593 10.9393 9.35137L7.93926 13.1014C7.74519 13.344 7.39121 13.3833 7.14863 13.1892Z"*/}
      {/*            fill="black"/>*/}
      {/*    </svg>*/}
      {/*  </button>*/}
      {/*</div>*/}
    </Slider>
  );
};

export default MainSlider;