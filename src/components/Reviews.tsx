'use client'
import StarRatings from 'react-star-ratings';
import Image from "next/image";
import {CourseReviews} from "@/types/course";

interface ReviewsProps {
  reviews?: CourseReviews;
  reviews_count?: string; // optional, we’ll prefer reviews.statistics.total
}

const Reviews = ({ reviews, reviews_count }: ReviewsProps) => {
  const { statistics, recent_reviews } = reviews || {};
  const total = statistics?.total ?? 0;
  const average = statistics?.average ?? 0;

  // Map your API distribution keys to star numbers 5..1
  const distMap: Record<number, number> = {
    5: statistics?.distribution?.five_star ?? 0,
    4: statistics?.distribution?.four_star ?? 0,
    3: statistics?.distribution?.three_star ?? 0,
    2: statistics?.distribution?.two_star ?? 0,
    1: statistics?.distribution?.one_star ?? 0,
  };

  const getBarWidth = (count: number) => {
    if (!total) return '0%';
    const pct = Math.round((count / total) * 100);
    return `${pct}%`;
  };

  const starSVGIconPath =
    'M9.153 5.408C10.42 3.136 11.053 2 12 2s1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182s.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506s-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452s-.674.15-1.328.452l-.596.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46c-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882S3.58 8.328 6.04 7.772l.636-.144c.699-.158 1.048-.237 1.329-.45s.46-.536.82-1.182z';

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-black text-[24px] font-semibold">Отзывы</h2>

      <div className="flex gap-5 w-full justify-between">
        {/* Summary */}
        <div className="flex flex-col w-[150px]">
          <h1 className="text-[72px] text-black font-semibold">
            {average?.toFixed ? average.toFixed(1) : Number(average).toFixed(1)}
          </h1>
          <StarRatings
            numberOfStars={5}
            rating={Number(average) || 0}
            starRatedColor="#FBBC55"
            svgIconPath={starSVGIconPath}
            svgIconViewBox="0 0 24 24"
            starDimension="18px"
            starSpacing="3px"
          />
          <p className="text-[#676E76] text-[14px] font-medium mt-1">
            {reviews_count ?? total} отзыв{(reviews_count ?? total) === 1 ? '' : 'ов'}
          </p>
        </div>

        {/* Distribution */}
        <div className="w-[65%] flex flex-col gap-3">
          {[5,4,3,2,1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-[#F6F7F9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FBBC55]"
                  style={{ width: getBarWidth(distMap[star]) }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{star}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="flex flex-col gap-6 w-full">
        {(recent_reviews ?? []).map((review) => (
          <div key={review.id} className="flex gap-5 justify-between">
            <div className="flex gap-2 w-[200px] items-start">
              <Image
                src={review.user_avatar ?? '/avatars.png'}
                alt={review.user_name ?? 'User avatar'}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div className="space-y-1">
                <h3 className="text-[16px] text-black font-semibold">{review.user_name}</h3>
                <p className="text-[12px] text-[#676E76] font-medium">Клиент</p>
              </div>
            </div>
            <div className="w-[65%] flex flex-col gap-2">
              <StarRatings
                numberOfStars={5}
                rating={Number(review.rating) || 0}
                starRatedColor="#FBBC55"
                svgIconPath={starSVGIconPath}
                svgIconViewBox="0 0 24 24"
                starDimension="18px"
                starSpacing="3px"
              />
              <p>{review.comment}</p>
              {/* Optional date */}
              {/* <span className="text-xs text-[#676E76]">
                {new Date(r.created_at).toLocaleDateString('ru-RU')}
              </span> */}
            </div>
          </div>
        ))}
      </div>

      <button
        className="w-full bg-white px-5 py-3 rounded-[0.5rem] border border-[#676E76] text-[#676E76] font-semibold"
      >
        Все отзывы ({total})
      </button>
    </div>
  );
};

export default Reviews;