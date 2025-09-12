import React from "react";

interface Stage {
  number: number;
  label: string;
}

interface CourseCreateStagesProps {
  currentStage: number; // active step
}

const stages: Stage[] = [
  { number: 1, label: "Информация о курсе" },
  { number: 2, label: "Программа уроков" },
  { number: 3, label: "Просмотр и публикация" },
];

const CourseCreateStages: React.FC<CourseCreateStagesProps> = ({ currentStage }) => {
  return (
    <div className="w-full flex gap-2.5">
      {stages.map((stage) => {
        const isActive = stage.number === currentStage;
        const isCompleted = stage.number < currentStage;
        const baseClasses =
          "flex items-center flex-1 gap-2 px-4 py-3 rounded-[8px] border-2 transition-colors";

        // ✅ style states
        const completedClasses = "bg-[#FFF2F2] border-none";
        const activeClasses = "border-[#F7A1A1] bg-white";
        const defaultClasses = "border-[#F9FAFB] text-[#9CA3AF] bg-[#F9FAFB]";

        return (
          <div
            key={stage.number}
            className={`${baseClasses} ${
              isActive ? activeClasses : isCompleted ? completedClasses : defaultClasses
            }`}
          >
            <div
              className={`flex justify-center items-center w-4 h-4 font-semibold rounded-full text-[12px] leading-none
              ${isActive || isCompleted ? "bg-[#EE7A67] text-white" : "bg-[#D1D5DB] text-white"}
              `}
            >
              {stage.number}
            </div>
            <p
              className={`text-[14px] font-semibold ${
                isActive
                  ? "text-[#EE7A67]"
                  : isCompleted
                    ? "text-[#EE7A67]"
                    : "text-gray-400"
              }`}
            >
              {stage.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default CourseCreateStages;
