"use client";

import {Icon} from "@iconify/react";
import CourseCreateStages from "@/components/CourseCreateStages";
import {useForm, useFieldArray} from "react-hook-form";
import {useSession} from "@/lib/useSession";
import {useState} from "react";
import {CourseService} from "@/services/course";
import {useQuery} from "@tanstack/react-query";
import {Category} from "@/types/course";


type FormValues = {
  title: string;
  description: string;
  price: string; // keep as text in the input, convert to number on submit
  category: string;
  access: "lifetime" | "1_year" | "2_years" | "6_months";
  youtube?: string;
  imageSrc?: string;
  features: { value: string }[];
  whatYouLearn: { value: string }[];
  categoryId: number;
};

const defaultValues: FormValues = {
  title: "",
  description: "",
  price: "",
  category: "Frontend",
  access: "lifetime",
  youtube: "",
  imageSrc: "",
  features: [{value: ""}],
  whatYouLearn: [{value: ""}],
  categoryId: -1,
};

const CourseCreateInfo = () => {
  const { session, ready } = useSession();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<FormValues>({defaultValues});

  const {fields: featureFields, append: addFeature, remove: removeFeature} = useFieldArray({
    control,
    name: "features",
  });

  const {fields: learnFields, append: addLearn, remove: removeLearn} = useFieldArray({
    control,
    name: "whatYouLearn",
  });

  const {data: categories, isLoading, error} = useQuery({
    queryKey: ["categories"],
    queryFn: () => CourseService.getCategories(session!.token),
    enabled: !!session?.token,
  });
  console.log("CATEGORY", categories);

  const onSubmit = async (data: FormValues) => {
    if (!session?.token) {
      alert("Вы не авторизованы");
      return;
    }
    try {
      setSubmitting(true);

      const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        price: data.price ? parseFloat(data.price) : 0,
        features: data.features.map((f) => f.value.trim()).filter((v) => v),
        whatYouLearn: data.whatYouLearn.map((f) => f.value.trim()).filter((v) => v),
        category_id: data.categoryId,
        access_duration: data.access,
        video_url: "https://www.youtube.com/watch?v=yO3Ep_bQYgw"
        // imageSrc: data.imageSrc?.trim() || "/images/placeholder-course.png",
        // progress: 0,
      };

      console.log(payload);
      // const res = await fetch("/api/courses", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      const result = await CourseService.createCourse(payload, session.token)
      console.log("RESULT", result)
      alert("Курс успешно создан! Перейдите к программе уроков.");
    } catch (e: any) {
      console.error(e);
      alert(`Ошибка: ${e.message || "Не удалось создать курс"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={"w-full h-full p-6 flex flex-col bg-white rounded-[20px] gap-6"}
    >
      {/* FLAGS PART */}
      {/*<CourseCreateStages currentStage={1}/>*/}

      {/* COURSE CREATE INFO INPUTS */}
      <div className={"w-full flex gap-6"}>
        <div className={"flex flex-1 flex-col gap-8"}>
          {/* COURSE NAME */}
          <div className={"w-full flex flex-col gap-2"}>
            <h3 className={"text-[12px] font-semibold"}>Название</h3>
            <input
              type={"text"}
              placeholder={"Название курса"}
              className={
                "w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px] outline-none"
              }
              {...register("title", {required: "Введите название курса"})}
            />
            {errors.title && (
              <span className="text-red-500 text-xs">{errors.title.message}</span>
            )}
          </div>

          {/* COURSE DESCRIPTION */}
          <div className={"w-full flex flex-col gap-2"}>
            <h3 className={"text-[12px] font-semibold"}>Описание</h3>
            <textarea
              placeholder={"Описание курса"}
              className={
                "w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px] resize-none outline-none"
              }
              rows={5}
              {...register("description", {
                required: "Добавьте описание курса",
                minLength: {value: 10, message: "Минимум 10 символов"},
              })}
            />
            <p className={"text-[12px] font-medium"}>
              Опишите в нескольких словах, о чем ваш курс.
            </p>
            {errors.description && (
              <span className="text-red-500 text-xs">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* COURSE PROS / FEATURES */}
          <div className={"w-full flex flex-col gap-2"}>
            <div className={"w-full flex gap-2 justify-between items-center"}>
              <h3 className={"text-[12px] font-semibold"}>Преимущества курса</h3>
              <p className={"text-[#4B5563] text-[12px] font-medium"}>
                Не больше 200 символов
              </p>
            </div>

            {featureFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`features.${i}.value` as const)}
                  placeholder="Пример текста..."
                  className="w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px]"
                />
                {featureFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="p-2 border rounded-[8px]"
                  >
                    <Icon icon="mdi:trash-outline" className="w-4 h-4"/>
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => addFeature({value: ""})}
              className="flex justify-center items-center flex-1 gap-2 px-4 py-3 border-2 border-[#F7A1A1] rounded-[8px]"
            >
              <p className="text-[14px] font-semibold text-[#EE7A67]">
                Добавить новое преимущество
              </p>
              <div className="text-[#EE7A67] font-bold">+</div>
            </button>
          </div>

          {/* COURSE ACCESS TIME */}
          <div className={"w-full flex flex-col gap-2"}>
            <h3 className={"text-[12px] font-semibold"}>Доступ у студента</h3>
            <select
              className={
                "w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px] outline-none"
              }
              {...register("access", {required: true})}
            >
              <option value="lifetime">Пожизненно</option>
              <option value="1_year">1 год</option>
              <option value="2_years">2 года</option>
              <option value="6_months">6 месяцев</option>
            </select>
            <p className={"text-[12px] font-medium"}>
              Установите время доступности курса у студента
            </p>
          </div>

          {/* COURSE PRICE */}
          <div className={"w-full flex flex-col gap-2"}>
            <h3 className={"text-[12px] font-semibold"}>Цена</h3>
            <input
              type={"text"}
              placeholder={"$99"}
              className={
                "w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px] outline-none"
              }
              {...register("price", {
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Введите число, например 199.99",
                },
              })}
            />
            <p className={"text-[12px] font-medium"}>
              Оставьте поле пустым, если ваш курс бесплатный
            </p>
            {errors.price && (
              <span className="text-red-500 text-xs">{errors.price.message}</span>
            )}
          </div>

          {/* COURSE CATEGORY */}
          <div className={"w-full flex flex-col gap-2"}>
            <h3 className={"text-[12px] font-semibold"}>Категория</h3>
            {isLoading ? (
              <div className="text-[12px] text-gray-500">Загрузка категорий…</div>
            ) : error ? (
              <div className="text-[12px] text-red-500">Не удалось загрузить категории</div>
            ) : (
              <select
                className={
                  "w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px] outline-none"
                }
                // valueAsNumber — чтобы сразу получить number из <option value="id">
                {...register("categoryId", {
                  required: "Выберите категорию",
                  valueAsNumber: true,
                })}
                disabled={!categories || categories.length === 0}
                defaultValue=""
              >
                <option value="" disabled>Выберите категорию</option>
                {categories?.map((c: Category) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        {/*RIGHT PART*/}
        <div className={"flex flex-1 flex-col gap-8"}>
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex justify-between items-center">
              <h3 className="text-[12px] font-semibold">Что вы узнаете</h3>
              <p className="text-[#4B5563] text-[12px] font-medium">
                Не больше 200 символов
              </p>
            </div>

            {learnFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`whatYouLearn.${i}.value` as const)}
                  placeholder="Например: Научитесь проектировать UX..."
                  className="w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px]"
                />
                {learnFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLearn(i)}
                    className="p-2 border rounded-[8px]"
                  >
                    <Icon icon="mdi:trash-outline" className="w-4 h-4"/>
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => addLearn({value: ""})}
              className="flex justify-center items-center flex-1 gap-2 px-4 py-3 border-2 border-[#F7A1A1] rounded-[8px]"
            >
              <p className="text-[14px] font-semibold text-[#EE7A67]">
                Добавить новый пункт
              </p>
              <div className="text-[#EE7A67] font-bold">+</div>
            </button>
          </div>
          {/* COVER IMAGE */}
          <div className="w-full flex flex-col gap-2">
            <h3 className="text-[12px] font-semibold">Обложка курса</h3>
            <label
              className="w-full min-h-[180px] rounded-[12px] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-center px-4 py-6 cursor-pointer">
              {/* If you later add real upload, set imageSrc after you upload and get a URL */}
              <input type="file" accept="image/png,image/jpeg,image/gif" className="hidden"/>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FFE8E3]">
                <Icon icon={"majesticons:image-plus-line"} className={"w-6 h-6 text-[#EE7A67]"}/>
              </div>
              <p className="text-[16px] font-semibold">Перетащите файл сюда</p>
              <p className="text-[13px] text-[#4B5563]">или нажмите здесь, чтобы загрузить</p>
            </label>
            <input
              type="text"
              placeholder="или вставьте URL обложки (optional)"
              className="w-full px-3.5 py-2.5 border border-[#E5E7EB] rounded-[8px] outline-none"
              {...register("imageSrc")}
            />
            <p className="text-[12px] text-[#4B5563]">Type of files allowed: png, jpg and gif.</p>
          </div>

          {/* VIDEO PRESENTATION (optional UI only) */}
          <div className="w-full flex flex-col gap-2">
            <h3 className="text-[12px] font-semibold">Видео презентация</h3>
            <label
              className="w-full min-h-[180px] rounded-[12px] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-center px-4 py-6 cursor-pointer">
              <input type="file" accept="video/mp4,video/quicktime" className="hidden"/>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FFE8E3]">
                <Icon icon={"carbon:video-add"} className={"w-6 h-6 text-[#EE7A67]"}/>
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
              {...register("youtube")}
            />
          </div>
        </div>
      </div>

      {/* CREATE BUTTON */}
      <button
        type="submit"
        disabled={submitting}
        className={
          "flex items-center gap-2 self-end bg-[#EE7A67] rounded-[8px] px-4 py-3 disabled:opacity-60"
        }
      >
        <span className={"text-white text-[16px] font-semibold"}>
          {submitting ? "Создание..." : "Перейти к программе"}
        </span>
        <Icon icon={"ep:right"} className={"w-5 h-5 text-white"}/>
      </button>
    </form>
  );
};

export default CourseCreateInfo;
