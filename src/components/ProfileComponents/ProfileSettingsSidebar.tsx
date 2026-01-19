import type { ProfileSection } from "./ProfileComponent";
import {Icon} from "@iconify/react";
import {useSession} from "@/lib/useSession";
import {useRouter} from "next/navigation";

type Props = {
  active: ProfileSection;
  onChange: (section: ProfileSection) => void;
};

const items: Array<{ key: ProfileSection; label: string; icon:string }> = [
  { key: "profile", label: "Редактировать профиль", icon: "solar:user-bold-duotone" },
  // { key: "account", label: "Настройки аккаунта" },
  { key: "password", label: "Пароль", icon: "ep:lock" },
  // { key: "notifications", label: "Уведомления" },
];

const ProfileSettingsSidebar = ({ active, onChange }: Props) => {
  const router = useRouter();
  const { removeSession } = useSession();

  const handleLogout = () => {
    removeSession();
    router.replace("/login");
  };

  return (
    <aside className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-semibold text-black text-center">Управление настройками</h3>

      <nav className="mt-4 space-y-1">
        {items.map((it) => {
          const isActive = active === it.key;

          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange(it.key)}
              className={[
                "w-full rounded-xl px-4 py-3 text-left text-[16px] transition flex items-center gap-2 leading-6",
                isActive
                  ? "bg-[#F6F7F9] font-semibold text-black"
                  : "text-[#676E76] hover:bg-[#F6F7F9] hover:text-black font-medium",
              ].join(" ")}
            >
              <Icon icon={it.icon} className={'w-5 h-5'}/>
              {it.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-6">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#F7A1A1] bg-white px-8 py-4 text-sm font-semibold leading-6 text-[#F34141] hover:bg-rose-50"
          onClick={handleLogout}
        >
          Выйти из аккаунта
          <Icon icon={'hugeicons:logout-square-01'} className={'w-5 h-5 text-[#F34141]'}/>
        </button>
      </div>
    </aside>
  );
};

export default ProfileSettingsSidebar;
