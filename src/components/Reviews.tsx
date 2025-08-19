'use client'
import StarRatings from 'react-star-ratings';
import Image from "next/image";

const Reviews = () => {
  const starSVGIconPath = 'M9.153 5.408C10.42 3.136 11.053 2 12 2s1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182s.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506s-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452s-.674.15-1.328.452l-.596.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46c-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882S3.58 8.328 6.04 7.772l.636-.144c.699-.158 1.048-.237 1.329-.45s.46-.536.82-1.182z"'
  // const starSVGIconPath =
  //   'M6.52461 1.45356C7.12812 0.182149 8.87187 0.182146 9.47539 1.45356L10.5184 3.65088C10.7581 4.15576 11.2213 4.5057 11.7572 4.58666L14.0895 4.93902C15.439 5.1429 15.9779 6.86716 15.0013 7.85681L13.3137 9.56719C12.9259 9.96019 12.749 10.5264 12.8405 11.0813L13.2389 13.4964C13.4694 14.8938 12.0587 15.9595 10.8517 15.2997L8.76562 14.1595C8.28631 13.8975 7.71369 13.8975 7.23438 14.1595L5.14832 15.2997C3.94129 15.9595 2.53057 14.8938 2.76109 13.4964L3.15949 11.0813C3.25103 10.5264 3.07408 9.96019 2.68631 9.56719L0.998656 7.85681C0.0221496 6.86716 0.560996 5.1429 1.9105 4.93902L4.24278 4.58666C4.77867 4.5057 5.24192 4.15576 5.48158 3.65088L6.52461 1.45356Z';

  return (
    <div className={'flex flex-col gap-4 w-full'}>
      <h2 className={'text-black text-[24px] font-semibold'}>Отзывы</h2>
      <div className={'flex gap-5 w-full justify-between'}>
        <div className={'flex flex-col w-[150px]'}>
          <h1 className={'text-[72px] text-black font-semibold'}>4.8</h1>
          <StarRatings
            numberOfStars={5}
            rating={4.3}
            starRatedColor={'#FBBC55'}
            svgIconPath={starSVGIconPath}
            svgIconViewBox="0 0 24 24"
            starDimension={'18px'}
            starSpacing={'3px'}
          />
          <p className={'text-[#676E76] text-[14px] font-medium mt-1'}>12 отзывов</p>
        </div>
        <div className="w-[65%] flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-[#F6F7F9] rounded-full overflow-hidden">
              <div className="h-full bg-[#FBBC55] w-[75%]"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">5</span>
          </div>
          <div className="flex items-center">
            <div className="flex-1 h-2 bg-[#F6F7F9] rounded-full overflow-hidden">
              <div className="h-full bg-[#FBBC55] w-[15%]"></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">4</span>
          </div>
          <div className="flex items-center">
            <div className="flex-1 h-2 bg-[#F6F7F9] rounded-full overflow-hidden">
              <div className="h-full bg-[#FBBC55] w-[5%]"></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">3</span>
          </div>
          <div className="flex items-center">
            <div className="flex-1 h-2 bg-[#F6F7F9] rounded-full overflow-hidden">
              <div className="h-full bg-[#FBBC55] w-[30%]"></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">2</span>
          </div>
          <div className="flex items-center">
            <div className="flex-1 h-2 bg-[#F6F7F9] rounded-full overflow-hidden">
              <div className="h-full bg-[#FBBC55] w-[5%]"></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">1</span>
          </div>
        </div>
      </div>
      <div className={'flex flex-col gap-6 w-full'}>
        <div className={'flex gap-5 justify-between'}>
          <div className={'flex gap-2 w-[200px] items-start'}>
            <Image src={'/avatars.png'} alt={""} width={48} height={48} className={'rounded-full'}/>
            <div className={'space-y-1'}>
              <h3 className={'text-[16px] text-black font-semibold'}>Finex-Audit</h3>
              <p className={'text-[12px] text-[#676E76] font-medium'}>Клиент</p>
            </div>
          </div>
          <div className={'w-[65%] flex flex-col gap-2'}>
            <StarRatings
              numberOfStars={5}
              rating={5}
              starRatedColor={'#FBBC55'}
              svgIconPath={starSVGIconPath}
              svgIconViewBox="0 0 24 24"
              starDimension={'18px'}
              starSpacing={'3px'}
            />
            <p className={''}>
              Lorem ipsum dolor sit amet consectetur. Tortor dolor nec cras euismod auctor.
            </p>
          </div>
        </div>
        <div className={'flex gap-5 justify-between'}>
          <div className={'flex gap-2 w-[200px] items-start'}>
            <Image src={'/avatars.png'} alt={""} width={48} height={48} className={'rounded-full'}/>
            <div className={'space-y-1'}>
              <h3 className={'text-[16px] text-black font-semibold'}>Finex-Audit</h3>
              <p className={'text-[12px] text-[#676E76] font-medium'}>Клиент</p>
            </div>
          </div>
          <div className={'w-[65%] flex flex-col gap-2'}>
            <StarRatings
              numberOfStars={5}
              rating={5}
              starRatedColor={'#FBBC55'}
              svgIconPath={starSVGIconPath}
              svgIconViewBox="0 0 24 24"
              starDimension={'18px'}
              starSpacing={'3px'}
            />
            <p className={''}>
              Lorem ipsum dolor sit amet consectetur. Tortor dolor nec cras euismod auctor.
            </p>
          </div>
        </div>
      </div>
      <button className={'w-full bg-white px-5 py-3 rounded-[0.5rem] border border-[#676E76] text-[#676E76] font-semibold'}>
        Все отзывы (9)
      </button>
    </div>
  );
};

export default Reviews;