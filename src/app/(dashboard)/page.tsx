'use client'
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  const welcomeMessage = user ? `Добро пожаловать, ${user.name}!` : 'Добро пожаловать в Tax Bilim!';
  const subtitle = user ? 'Ваша панель управления готова к использованию.' : 'Пожалуйста, войдите в систему.';

  return (
    <div className={'flex justify-between items-start gap-5 px-10 w-full h-full'}>
      <div className={'flex flex-col gap-5 w-[60%] h-full'}>
        <div className={'w-full flex flex-col gap-6 p-6 bg-white rounded-[20px]'}>
          <h2 className={'text-black text-[1.5rem] font-semibold'}>{welcomeMessage}</h2>
          <p className={'text-gray-600'}>{subtitle}</p>
        </div>
      </div>
      <div className={'w-[40%] p-6 bg-white rounded-[20px] gap-6 flex flex-col'}>
        <h1 className={'text-[24px] font-semibold text-black'}>Мое обучение</h1>
        <p className={'text-gray-600'}>Здесь будут отображаться ваши курсы.</p>
      </div>
    </div>
  )
}
