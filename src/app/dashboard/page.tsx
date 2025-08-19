'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  certificates: number;
  totalProgress: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    enrolledCourses: 0,
    completedCourses: 0,
    certificates: 0,
    totalProgress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch user data
        const userResponse = await fetch('http://localhost:5001/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.user);
        }

        // Fetch enrollments
        const enrollmentsResponse = await fetch('http://localhost:5001/api/enrollments/my-enrollments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (enrollmentsResponse.ok) {
          const enrollmentsData = await enrollmentsResponse.json();
          const enrollments = enrollmentsData.enrollments || [];
          const completedCourses = enrollments.filter((e: any) => e.completed_at !== null).length;
          
          setStats({
            enrolledCourses: enrollments.length,
            completedCourses,
            certificates: completedCourses, // Assuming one certificate per completed course
            totalProgress: enrollments.length > 0 ? Math.round((completedCourses / enrollments.length) * 100) : 0
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const welcomeMessage = user ? `Добро пожаловать, ${user.name}!` : 'Добро пожаловать в TaxBilim!';
  const subtitle = user ? 'Ваша панель управления готова к использованию.' : 'Пожалуйста, войдите в систему.';

  const quickActions = [
    {
      title: 'Мои курсы',
      description: 'Просмотр ваших курсов',
      icon: 'mdi:book-open-variant',
      href: '/myEducation',
      color: 'bg-blue-500'
    },
    {
      title: 'Все курсы',
      description: 'Найти новые курсы',
      icon: 'mdi:school',
      href: '/courses',
      color: 'bg-green-500'
    },
    {
      title: 'Сертификаты',
      description: 'Ваши достижения',
      icon: 'mdi:certificate',
      href: '/myCertificates',
      color: 'bg-purple-500'
    },
    {
      title: 'Избранное',
      description: 'Сохраненные курсы',
      icon: 'mdi:heart',
      href: '/courses?favorites=true',
      color: 'bg-red-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка панели управления...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 w-full h-full">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-[20px]">
        <h1 className="text-3xl font-bold mb-2">{welcomeMessage}</h1>
        <p className="text-blue-100">{subtitle}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[20px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Записанных курсов</p>
              <p className="text-2xl font-bold text-gray-900">{stats.enrolledCourses}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:book-open-variant" className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Завершенных курсов</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedCourses}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:check-circle" className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Сертификатов</p>
              <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:certificate" className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Общий прогресс</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProgress}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:trending-up" className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-[20px] shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon icon={action.icon} className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-[20px] shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Недавняя активность</h2>
        {stats.enrolledCourses > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon icon="mdi:book-open" className="text-blue-600 text-sm" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Вы записались на {stats.enrolledCourses} курсов</p>
                <p className="text-sm text-gray-600">Продолжайте обучение для получения сертификатов</p>
              </div>
            </div>
            {stats.completedCourses > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Icon icon="mdi:check-circle" className="text-green-600 text-sm" />
                </div>
                <div>
                                   <p className="font-medium text-gray-900">Поздравляем! Вы завершили {stats.completedCourses} курсов</p>
                 <p className="text-sm text-gray-600">Получите ваши сертификаты в разделе &quot;Мои сертификаты&quot;</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon icon="mdi:book-open-variant" className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-600 mb-4">У вас пока нет записанных курсов</p>
            <Link
              href="/courses"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icon icon="mdi:plus" className="mr-2" />
              Найти курсы
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 