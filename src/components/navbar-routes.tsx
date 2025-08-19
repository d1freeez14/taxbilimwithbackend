"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {IconChat} from "@/shared/icons/IconChat";
import {IconNotifications} from "@/shared/icons/IconNotifications";
import {IconMore} from "@/shared/icons/IconMore";
import Image from "next/image";
import {guestRoutes} from "@/shared/routes";
import { Icon } from "@iconify/react";

interface User {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
  role: string;
}

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();
  const currentGuest = guestRoutes.find(route => route.href === pathname);
  const title = currentGuest?.label ?? '';
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5001/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    router.push('/');
  };

  const handleProfile = () => {
    setShowDropdown(false);
    // Could navigate to a profile page in the future
  };

  const handleSettings = () => {
    setShowDropdown(false);
    // Could navigate to settings page in the future
  };

  return (
    <div className={'w-full flex justify-between items-center gap-1 px-10 py-5'}>
      <h1 className={'text-[30px] font-semibold'}>{title}</h1>
      <div className={'flex items-center gap-3'}>
        <div className={'p-[15px] bg-white rounded-full text-black hover:bg-gray-50 cursor-pointer transition-colors'}>
          <IconChat/>
        </div>
        <div className={'p-[15px] bg-white rounded-full text-black hover:bg-gray-50 cursor-pointer transition-colors'}>
          <IconNotifications/>
        </div>
        <div className={'relative'}>
          <div className={'flex items-center gap-2 p-2 bg-white rounded-full cursor-pointer hover:bg-gray-50 transition-colors'} onClick={() => setShowDropdown(!showDropdown)}>
            <Image src={'/avatars.png'} alt={'avatar'} width={48} height={48}/>
            <div className={'flex flex-col gap-1'}>
              {loading ? (
                <>
                  <h2 className={'text-[16px] font-semibold'}>Loading...</h2>
                  <p className={'text-[12px] font-medium text-[#676E76]'}>Loading...</p>
                </>
              ) : user ? (
                <>
                  <h2 className={'text-[16px] font-semibold'}>{user.name}</h2>
                  <p className={'text-[12px] font-medium text-[#676E76]'}>{user.email}</p>
                </>
              ) : (
                <>
                  <h2 className={'text-[16px] font-semibold'}>Guest</h2>
                  <p className={'text-[12px] font-medium text-[#676E76]'}>Not logged in</p>
                </>
              )}
            </div>
            <button>
              <IconMore/>
            </button>
          </div>
          
          {/* Dropdown Menu */}
          {showDropdown && user && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-1">
                <button
                  onClick={handleProfile}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Icon icon="mdi:account" className="mr-3 text-gray-500" />
                  Профиль
                </button>
                <button
                  onClick={handleSettings}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Icon icon="mdi:cog" className="mr-3 text-gray-500" />
                  Настройки
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Icon icon="mdi:logout" className="mr-3" />
                  Выйти
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}