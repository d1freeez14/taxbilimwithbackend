import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            TaxBilim LMS
          </h1>
          <p className="text-gray-600 mb-8">
            Система управления обучением
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/dashboard" 
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Перейти в Dashboard
            </Link>
            
            <Link 
              href="/login" 
              className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Войти
            </Link>
            
            <Link 
              href="/register" 
              className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Регистрация
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>API Backend: <a href="http://89.219.32.91:5001" className="text-blue-600 hover:underline">http://89.219.32.91:5001</a></p>
            <p>API Docs: <a href="http://89.219.32.91:5001/api-docs" className="text-blue-600 hover:underline">http://89.219.32.91:5001/api-docs</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
