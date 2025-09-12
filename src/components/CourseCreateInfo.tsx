import {Icon} from "@iconify/react";
import CourseCreateStages from "@/components/CourseCreateStages";

const CourseCreateInfo = () => {
  return (
    <div className={'w-full h-full p-6 flex flex-col bg-white rounded-[20px] gap-6'}>
      {/*FLAGS PART*/}
      <CourseCreateStages currentStage={1} />
      {/*COURSE CREATE INFO INPUTS*/}
      <div className={'w-full flex gap-6'}>
        <div className={'flex flex-1 flex-col gap-8'}>
          {/*COURSE NAME*/}
          <div className={'w-full flex flex-col gap-2'}>
            <h3 className={'text-[12px] font-semibold'}>Название</h3>
            <input type={'text'} placeholder={'Название курса'}
                   className={'w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px] outline-none'}/>
          </div>
          {/*COURSE DESCRIPTION*/}
          <div className={'w-full flex flex-col gap-2'}>
            <h3 className={'text-[12px] font-semibold'}>Описание</h3>
            <textarea placeholder={'Описание курса'}
                      className={'w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px] resize-none outline-none'}/>
            <p className={'text-[12px] font-medium'}>Опишите в нескольких словах, о чем ваш курс.</p>
          </div>
          {/*COURSE PROS*/}
          <div className={'w-full flex flex-col gap-2'}>
            <div className={'w-full flex gap-2 justify-between items-center'}>
              <h3 className={'text-[12px] font-semibold'}>Преимущества курса</h3>
              <p className={'text-[#4B5563] text-[12px] font-medium'}>Не больше 200 символов</p>
            </div>
            <input type={'text'} placeholder={'Пример текста...'}
                   className={'w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px] outline-none'}/>
            <button
              className={'flex justify-center items-center flex-1 gap-2 px-4 py-3 border-2 border-[#F7A1A1] rounded-[8px]'}>
              <p className={'text-[14px] font-semibold text-[#EE7A67]'}>
                Добавить новое преимущество
              </p>
              <div
                className={'flex justify-center items-center w-4.5 h-4.5 text-[12px] font-semibold text-[#EE7A67] rounded-full'}>
                +
              </div>
            </button>
          </div>
          {/*COURSE ACCESS TIME*/}
          <div className={'w-full flex flex-col gap-2'}>
            <h3 className={'text-[12px] font-semibold'}>Доступ у студента</h3>
            <select className={'w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px] outline-none'}>
              <option>Пожизненно</option>
              <option>1 год</option>
              <option>2 года</option>
            </select>
            <p className={'text-[12px] font-medium'}>Установите время доступности курса у студента</p>
          </div>
          {/*COURSE PRICE*/}
          <div className={'w-full flex flex-col gap-2'}>
            <h3 className={'text-[12px] font-semibold'}>Цена</h3>
            <input type={'text'} placeholder={'$99'}
                   className={'w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px] outline-none'}/>
            <p className={'text-[12px] font-medium'}>Оставьте поле пустым, если ваш курс бесплатный</p>
          </div>
          {/*COURSE CATEGORY*/}
          <div className={'w-full flex flex-col gap-2'}>
            <h3 className={'text-[12px] font-semibold'}>Категория</h3>
            <select className={'w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px] outline-none'}>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Design</option>
              <option>Law</option>
            </select>
          </div>
        </div>
        <div className={'flex flex-1 flex-col gap-8'}>
          {/* COVER IMAGE */}
          <div className="w-full flex flex-col gap-2">
            <h3 className="text-[12px] font-semibold">Обложка курса</h3>
            <label className="w-full min-h-[180px] rounded-[12px] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-center px-4 py-6 cursor-pointer">
              <input type="file" accept="image/png,image/jpeg,image/gif" className="hidden" />
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FFE8E3]">
                <Icon icon={'majesticons:image-plus-line'} className={'w-6 h-6 text-[#EE7A67]'}/>
              </div>
              <p className="text-[16px] font-semibold">Перетащите файл сюда</p>
              <p className="text-[13px] text-[#4B5563]">или нажмите здесь, чтобы загрузить</p>
            </label>
            <p className="text-[12px] text-[#4B5563]">Type of files allowed: png, jpg and gif.</p>
          </div>

          {/* VIDEO PRESENTATION */}
          <div className="w-full flex flex-col gap-2">
            <h3 className="text-[12px] font-semibold">Видео презентация</h3>
            <label className="w-full min-h-[180px] rounded-[12px] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-center px-4 py-6 cursor-pointer">
              <input type="file" accept="video/mp4,video/quicktime" className="hidden" />
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FFE8E3]">
                <Icon icon={'carbon:video-add'} className={'w-6 h-6 text-[#EE7A67]'}/>
              </div>
              <p className="text-[16px] font-semibold">Перетащите файл сюда</p>
              <p className="text-[13px] text-[#4B5563]">или нажмите здесь, чтобы загрузить</p>
            </label>
            <p className="text-[12px] text-[#4B5563]">Type of files allowed: mp4 and mov.</p>
          </div>

          {/* YOUTUBE LINK */}
          <div className="w-full flex flex-col gap-2">
            <h3 className="text-[12px] font-semibold">Или введите ссылку с YouTube</h3>
            <input
              type="url"
              placeholder="https://youtu.be/dQw4w9WgXcQ?si=zMovVmWCScfQ3uPN"
              className="w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px] outline-none"
            />
          </div>
        </div>
      </div>
      {/*CREATE BUTTON*/}
      <button className={'flex items-center gap-2 self-end bg-[#EE7A67] rounded-[8px] px-4 py-3'}>
        <span className={'text-white text-[16px] font-semibold'}>Перейти к программе</span>
        <Icon icon={'ep:right'} className={'w-5 h-5 text-white'}/>
      </button>
    </div>
  );
};

export default CourseCreateInfo;