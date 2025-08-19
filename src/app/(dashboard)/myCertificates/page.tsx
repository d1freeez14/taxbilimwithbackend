'use client'
import CertificateCard from "@/components/CertificateCard";
import {Icon} from "@iconify/react";
import {useState, useEffect} from "react";

interface Certificate {
  id: number;
  user_id: number;
  course_id: number;
  certificate_url: string;
  issued_at: string;
  course_title: string;
  course_image: string;
  author_name: string;
}

const MyCertificates = () => {
  const [sortBy, setSortBy] = useState('Дата: новая');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const sortOptions = [
    'Дата: новая',
    'Дата: старая',
    'Название A → Z',
    'Название Z → A',
    'Популярности',
  ];

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5001/api/certificates/my-certificates', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCertificates(data.certificates || []);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);
  return (
    <div className={'w-full h-full flex flex-col items-start gap-8 px-10 py-5'}>
      <div className={'flex items-center justify-between gap-3 w-full'}>
        <div className={'flex items-center gap-3'}>
          <div className={'flex items-center gap-2 p-3.5 bg-white border border-[#9EA5AD] rounded-[0.5rem]'}>
            <Icon icon={'mingcute:search-line'} className={'w-[18px] h-[18px] text-[#9EA5AD]'}/>
            <input 
              type={'text'} 
              placeholder={'Поиск по названию или по дате'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={'w-72 text-[1rem] outline-none bg-transparent'}
            />
          </div>
          <button className={'text-white bg-[#EE7A67] text-[1rem] py-3.5 px-5 rounded-[0.5rem]'}>
            Поиск
          </button>
        </div>
        {/*SELECT*/}
        <div className="flex items-center gap-1 p-3.5 bg-white border border-[#9EA5AD] rounded-[0.5rem] relative">
          <span className="text-[1rem] font-medium text-black">
            Сортировать по
          </span>
          <Icon
            icon="mdi:swap-vertical"
            className="w-[18px] h-[18px] text-[#EE7A67]"
          />

          {/* invisible native select on top */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            {sortOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="w-full text-center py-10">
          <p className="text-gray-600">Loading certificates...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="w-full text-center py-10">
          <p className="text-gray-600">No certificates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-3 xl:gap-6 w-full">
          {certificates
            .filter(cert => 
              cert.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cert.issued_at.includes(searchTerm)
            )
            .map((certificate) => (
              <CertificateCard 
                key={certificate.id} 
                certificate={{
                  id: certificate.id,
                  imageSrc: certificate.course_image,
                  author: {
                    name: certificate.author_name,
                    avatarSrc: "/avatars.png" // Default avatar
                  },
                  category: "Налогообложение", // Default category
                  courseTitle: certificate.course_title,
                  dateReceived: new Date(certificate.issued_at).toLocaleDateString('ru-RU')
                }}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default MyCertificates;