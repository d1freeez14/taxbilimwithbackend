'use client';

import { useMemo, useState } from 'react';

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { rating: number; text: string }) => void;
  initialRating?: number;
  initialText?: string;
  loading?: boolean;
};

const Star = ({
                filled,
                onClick,
                onHover,
                onLeave,
                label,
              }: {
  filled: boolean;
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
  label: string;
}) => {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="flex items-center justify-center"
    >
      <svg
        viewBox="0 0 24 24"
        className={`
          aspect-square
          max-w-[92px]
          w-[clamp(40px,12vw,92px)]
          ${filled ? 'fill-[#FFC107]' : 'fill-transparent'}
        `}
      >
        {/*<path*/}
        {/*  d="M12 17.27l5.18 3.05-1.64-5.81L20 9.24l-5.9-.5L12 3.5 9.9 8.74 4 9.24l4.46 5.27-1.64 5.81L12 17.27z"*/}
        {/*/>*/}
        <path stroke="#FFC107"
              strokeWidth="1"
              d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/>
      </svg>
    </button>
  );
};

const ReviewModal = ({
                       isOpen,
                       onClose,
                       onSubmit,
                       initialRating = 0,
                       initialText = '',
                       loading = false,
                     }: ReviewModalProps) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [text, setText] = useState<string>(initialText);

  const shownRating = hoverRating || rating;

  const canSend = useMemo(() => rating > 0 && text.trim().length > 0 && !loading, [rating, text, loading]);

  if (!isOpen) return null;

  const submit = () => {
    if (!canSend) return;
    onSubmit?.({ rating, text: text.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col relative w-full max-w-[640px] rounded-2xl bg-white p-5 shadow-xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="self-end text-[#EE7A67] text-xl leading-none"
          aria-label="Close"
          type="button"
        >
          ✕
        </button>

        {/* Title + subtitle */}
        <h2 className="text-[24px] leading-6 font-semibold text-black text-center">Желаете оставить отзыв?</h2>
        <p className="text-[14px] text-[#383F45] text-center">
          Ваш отзыв поможет нам делать наши продукты еще лучше
        </p>

        {/* Rating */}
        <div className="mt-6 text-left">
          <p className="text-[14px] text-[#454C52] font-medium">Ваша оценка</p>

          <div className="mt-2 flex w-full items-center justify-between">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                filled={shownRating >= i}
                label={`Rate ${i} stars`}
                onClick={() => setRating(i)}
                onHover={() => setHoverRating(i)}
                onLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="mt-6 text-left">
          <p className="text-[14px] text-[#454C52] font-medium">Ваш отзыв</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Мне понравился курс..."
            className="mt-2 h-[140px] w-full resize-none rounded-xl border border-[#E7E7E7] bg-white p-3 text-[14px] outline-none focus:border-[#EE7A67]"
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 flex-1 rounded-xl border border-[#E7E7E7] bg-white text-[13px] font-medium text-[#333] hover:bg-[#F7F7F7]"
          >
            Вернуться назад
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={!canSend}
            className="h-10 flex-1 rounded-xl bg-[#EE7A67] text-[13px] font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95"
          >
            {loading ? 'Отправка...' : 'Отправить отзыв'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
