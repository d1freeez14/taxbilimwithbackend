'use client'
import {useState} from "react";
import Image from "next/image";

const LandingQuestions = () => {
  const questions = [
    {
      header: "Сколько длятся курсы?",
      desc: "Вы можете выбрать налогового консультанта на основе их рейтинга, отзывов и опыта, используя наш удобный поиск по специалистам.",
    },
    {
      header: "Можно ли проходить обучение в удобное время?",
      desc: "Да, вы можете проходить обучение в любое удобное для вас время, так как курсы доступны онлайн.",
    },
    {
      header: "Будет ли сертификат после завершения?",
      desc: "После прохождения курса вы получите официальный сертификат, подтверждающий ваши знания.",
    },
    {
      header: "Подходит ли платформа новичкам?",
      desc: "Да, наши курсы рассчитаны как на начинающих, так и на опытных пользователей.",
    },
  ];

  return (
    <div className="w-full h-full py-20 px-56 flex flex-col gap-16 bg-white">
      <div className="flex flex-col gap-12">
        <h1 className="text-[54px] leading-[120%] font-semibold text-black text-center">
          Часто задаваемые вопросы
        </h1>

        <div className="divide-y divide-[#D0D5DD]">
          {questions.map((q, i) => (
            <QuestionComponent key={i} header={q.header} desc={q.desc} isFirst={i === 0}/>
          ))}
        </div>
      </div>
      <div className={'bg-[#F6F7F9] p-8 flex flex-col gap-8 justify-center items-center rounded-[24px]'}>
        <Image src={'/questionsImg.svg'} alt={'questionsImg'} width={120} height={120} className={'object-contain'}/>
        <div className={'flex flex-col gap-2 justify-center items-center'}>
          <h3 className={'text-[20px] font-semibold text-black leading-[120%] text-center'}>У вас еще есть вопросы?</h3>
          <p className={'text-[18px] leading-[28px] text-[#667085] w-[60%] text-center'}>
            Вы не нашли ответ, который вам нужен? Пожалуйста, обратитесь к нашей команде в чате поддержки оставив
            заявку.
          </p>
        </div>
        <button
          className={'px-7 py-3 text-[16px] leading-[28px] font-semibold bg-[#EE7A67] rounded-[40px] text-white'}>
          Свяжитесь с нами
        </button>
      </div>
    </div>
  );
};

const QuestionComponent = ({
                             header,
                             desc,
                             isFirst,
                           }: {
  header: string;
  desc: string;
  isFirst?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`py-6 ${!isFirst ? "border-t border-[#D0D5DD]" : ""}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-start text-left"
      >
        <span className="text-[16px] leading-[140%] font-semibold text-[#0B1611]">
          {header}
        </span>
        <span className="text-[28px] leading-none font-light">
          {isOpen ? "—" : "+"}
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pt-4 text-[16px] leading-[140%] text-[#5F6980]">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingQuestions;