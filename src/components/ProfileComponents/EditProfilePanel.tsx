import {useEffect, useMemo, useState} from "react";
import Image from "next/image";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useSession} from "@/lib/useSession";
import {AuthService} from "@/services/auth";
import toast from "react-hot-toast";

const cities = ["Астана", "Алматы", "Шымкент", "Караганда", "Актобе"];

const EditProfilePanel = () => {
  const { session, ready, saveSession } = useSession();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("Астана");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");

  const canSave = useMemo(() => {
    return firstName.trim() && lastName.trim()
  }, [firstName, lastName]);

  const {data, isLoading, error} = useQuery({
    queryKey: ["profile_data"],
    queryFn: () => AuthService.getProfile(session!.token),
    enabled: !!session?.token,
  });
  const { mutate: updateProfile, isPending: updating } = useMutation({
    mutationFn: (payload: { name?: string; avatar?: string | null }) =>
      AuthService.updateProfile(session!.token, payload),
    onSuccess: async (res) => {
      toast.success("Профиль обновлён");
      saveSession({
        token: session!.token,
        user: res.user,
      });
      await queryClient.invalidateQueries({ queryKey: ["profile_data"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Ошибка обновления профиля");
      console.error(err);
    },
  });
  useEffect(() => {
    if (!data) return;

    // name: "Teacher User" → имя + фамилия
    const [fn = "", ln = ""] = data.user.name?.split(" ") || [];

    setFirstName(fn);
    setLastName(ln);

    // setCity(data.user.city || "Астана");

    // если дата в ISO формате
    // if (data.birth_date) {
    //   setBirthDate(data.birth_date.slice(0, 10)); // YYYY-MM-DD
    // }

    // setPhone(data.phone || "");
  }, [data]);

  const onSave = () => {
    updateProfile({
      name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      // avatar: null or "https://..." when you add upload
    });
  };
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-black">Редактировать профиль</h2>

      {/* avatar */}
      <div className="mt-6 flex items-center gap-8">
        <Image src={'/profileImg.png'} alt={'profileImg'} width={150} height={150} className={''}/>

        <div>
          <button
            type="button"
            className="text-lg font-semibold text-black"
            onClick={() => console.log("upload")}
          >
            Загрузите фото
          </button>
          <p className="mt-2.5 text-xs text-[#9EA5AD] font-medium">500×500 пикселей и максимум 2 MB</p>
        </div>
      </div>

      {/* form */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-[#676E76]">Личные данные</h3>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <div>
            <label className="text-xs font-medium text-[#454C52]">Имя</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-md outline-none focus:border-gray-300"
              placeholder="Введите имя"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#454C52]">Фамилия</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-md outline-none focus:border-gray-300"
              placeholder="Введите фамилию"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#454C52]">Местонахождение</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-md outline-none focus:border-gray-300"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#454C52]">Дата рождения</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-md outline-none focus:border-gray-300"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#454C52]">Номер телефона</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-md outline-none focus:border-gray-300"
              placeholder="+7 (___) ___-__-__"
            />
          </div>
        </div>

        {/* actions */}
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-xl px-2 py-4 text-sm font-semibold text-[#9EA5AD] hover:bg-gray-50"
            onClick={() => {
              // reset back to server values quickly:
              if (!data?.user) return;
              const [fn = "", ln = ""] = (data.user.name || "").split(" ");
              setFirstName(fn);
              setLastName(ln);
            }}
            disabled={updating || isLoading}
          >
            Отменить
          </button>

          <button
            type="button"
            disabled={!canSave || updating || isLoading}
            className={[
              "rounded-xl px-2 py-4 text-sm font-medium text-white",
              canSave && !updating ? "bg-[#EE7A67] hover:bg-opacity-90" : "bg-rose-200 cursor-not-allowed",
            ].join(" ")}
            onClick={onSave}
          >
            {updating ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default EditProfilePanel;
