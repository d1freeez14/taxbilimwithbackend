'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {Navbar} from "../(dashboard)/_components/navbar";
import {Sidebar} from "../(dashboard)/_components/sidebar";

const DashboardLayout = ({
                           children
                         }: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="h-full w-full flex">
      <div className="hidden md:flex h-screen w-[250px] flex-col bg-white">
        <Sidebar/>
      </div>
      <main className="h-full w-full md:w-[calc(100%-250px)] bg-[#F6F7F9] overflow-y-auto">
        <div className="h-[80px] w-full z-50">
          <Navbar/>
        </div>
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout; 