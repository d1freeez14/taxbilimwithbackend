import {Icon} from "@iconify/react";

interface DashboardInfoCardsProps{
  type: string;
  data: number | string;
}

const DashboardInfoCards = ({type, data}:DashboardInfoCardsProps) => {
  const renderHeader = (type:string) => {
    let title: string = "";
    let icon: string = "";

    if (type === "income") {
      title = "Общий доход";
      icon = "mage:dollar";
    } else if (type === "soldCourses") {
      title = "Продано курсов";
      icon = "mage:book-text";
    } else if (type === "studentNumber") {
      title = "Общее количество студентов";
      icon = "heroicons:user-group-16-solid";
    } else {
      title = "Неизвестный тип";
      icon = "mdi:alert-circle-outline";
    }

    return(
      <div className={'flex items-center gap-3'}>
        <div className={'p-2.5 bg-[#FEF2F2] rounded-[8px]'}>
          <Icon icon={icon} className={'w-5 h-5 text-[#EE7A67]'}/>
        </div>
        <p className={'text-[14px] font-medium'}>{title}</p>
      </div>
    )
  }
  return (
    <div className={'flex flex-col gap-2.5 w-full h-full min-w-80 bg-white p-6 border border-white rounded-[20px]'}>
      {renderHeader(type)}
      <h2 className={'text-[30px] font-bold'}>{data} {type === 'income' && `₸`}</h2>
      <div className={'flex items-center gap-2'}>
        <p className={'text-[#31B648] text-[12px] font-medium flex items-center gap-1'}>
          <Icon icon={'streamline:graph-arrow-increase'} className={'w-4 h-4'}/>
          12%
        </p>
        <p className={'text-[14px] font-medium text-wrap text-[#596066]'}>
          по сравнению с прошлым месяцем
        </p>
      </div>
    </div>
  );
};

export default DashboardInfoCards;
