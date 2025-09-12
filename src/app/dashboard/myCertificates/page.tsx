'use client'
import CertificateCard from "@/components/CertificateCard";
import {Icon} from "@iconify/react";
import {useState, useEffect} from "react";
import {Certificate} from "@/types/certificate";
import {useQuery} from "@tanstack/react-query";
import {CourseService} from "@/services/course";
import {useSession} from "@/lib/useSession";

const MyCertificates = () => {
  const {getSession} = useSession()
  const session = getSession();
  const [sortBy, setSortBy] = useState('Дата: новая');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const sortOptions = [
    'Дата: новая',
    'Дата: старая',
    'Название A → Z',
    'Название Z → A',
    'Популярности',
  ];

  const {
    data: certificates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["certificates", session?.token],
    queryFn: () => CourseService.getMyCertificates(session!.token),
    enabled: !!session?.token,
  });

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