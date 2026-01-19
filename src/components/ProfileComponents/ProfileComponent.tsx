'use client'
import {useState} from "react";
import ProfileSettingsSidebar from "@/components/ProfileComponents/ProfileSettingsSidebar";
import EditProfilePanel from "@/components/ProfileComponents/EditProfilePanel";
import PasswordPanel from "@/components/ProfileComponents/PasswordPanel";

export type ProfileSection = "profile" | "account" | "password" | "notifications";

const ProfileComponent = () => {
  const [active, setActive] = useState<ProfileSection>("profile");

  return (
    <div className="h-full w-full">
      <div className="px-10 py-4">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_1fr] items-start">
          {/* LEFT */}
          <ProfileSettingsSidebar active={active} onChange={setActive} />

          {/* RIGHT */}
          {active === "profile" && <EditProfilePanel />}
          {active === "password" && <PasswordPanel />}

        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
