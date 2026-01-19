import { useMemo, useState } from "react";

const PasswordPanel = () => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [repeatPass, setRepeatPass] = useState("");

  const canSave = useMemo(() => {
    if (!oldPass || !newPass || !repeatPass) return false;
    if (newPass.length < 6) return false;
    if (newPass !== repeatPass) return false;
    return true;
  }, [oldPass, newPass, repeatPass]);

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-black">Пароль</h2>

      <div className="mt-6 grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-medium text-[#454C52]">Старый пароль</label>
          <input
            type="password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gray-300"
            placeholder="Введите свой старый пароль"
          />
          <button
            type="button"
            className="mt-2 text-xs font-medium text-[#EE7A67] hover:text-[#ee8b68]"
            onClick={() => console.log("forgot password")}
          >
            Забыли пароль?
          </button>
        </div>

        <div>
          <label className="text-sm font-medium text-[#454C52]">Новый пароль</label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gray-300"
            placeholder="Введите новый пароль"
          />
          <p className="mt-1 text-xs text-gray-400">Минимум 6 символов</p>
        </div>

        <div>
          <label className="text-sm font-medium text-[#454C52]">Повторите новый пароль</label>
          <input
            type="password"
            value={repeatPass}
            onChange={(e) => setRepeatPass(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-gray-300"
            placeholder="Введите снова новый пароль"
          />
          {repeatPass && repeatPass !== newPass && (
            <p className="mt-1 text-xs text-[#EE7A67]">Пароли не совпадают</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          type="button"
          className="rounded-xl px-2 py-4 text-sm font-medium text-[#9EA5AD] hover:bg-gray-50"
          onClick={() => {
            setOldPass("");
            setNewPass("");
            setRepeatPass("");
          }}
        >
          Отменить
        </button>

        <button
          type="button"
          disabled={!canSave}
          className={[
            "rounded-xl px-2 py-4 text-sm font-medium text-white",
            canSave ? "bg-[#EE7A67] hover:bg-opacity-90" : "bg-rose-200 cursor-not-allowed",
          ].join(" ")}
          onClick={() => console.log("save password")}
        >
          Сохранить изменения
        </button>
      </div>
    </section>
  );
};

export default PasswordPanel;
