'use client';

import { useEffect } from 'react';
import Image from "next/image";
import {useMutation, useQuery} from "@tanstack/react-query";
import {CourseService} from "@/services/course";
import {useSession} from "@/lib/useSession";
import {useRouter} from "next/navigation";

interface FinishedCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

const FinishedCourseModal = ({
                               isOpen,
                               onClose,
                               courseId,
                             }: FinishedCourseModalProps) => {
  const { session, ready } = useSession();
  const router = useRouter();

  const {data: course} = useQuery({
    queryKey: ["modules", courseId, session?.token],
    queryFn: () => CourseService.getMyEducationByCourseId(courseId, session!.token),
    enabled: !!courseId && !!session?.token,
  });

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const { mutate: finishCourse, isPending } = useMutation({
    mutationFn: async () => {
      if (!session?.token) throw new Error("No token");
      if (!course) return;
      return CourseService.markCourseComplete(course.id, session.token);
    },
    onSuccess: async () => {
    },
  });

  const closeModal = () => {
    router.push(`/dashboard/myEducation/${courseId}`);
    onClose()
  }
  const getCertificate = () => {
    router.push(`/dashboard/myCertificates`);
    onClose()
  }
  useEffect(() => {
    if (!isOpen) return;
    if (!course) return;
    if (!session?.token) return;

    finishCourse();
  }, [isOpen, course, session?.token]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-80 lg:w-96 rounded-2xl bg-white p-5 text-center shadow-xl">

        {/* Close */}
        <button
          onClick={closeModal}
          className="absolute right-5 top-5 text-[#EE7A67] text-xl"
        >
          ✕
        </button>

        <div className="mt-6 mb-7 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center">
            <Image src={'/finishedCourseIcon.svg'} alt={'finished course image'} width={32} height={32}/>
          </div>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-black">
          Поздравляю, вы завершили курс!
        </h2>
        <p className="mb-7 text-gray-800 font-normal">
          Вы окончили курс&nbsp;
          <span className="font-medium text-gray-900">
            {course?.title}
          </span>
        </p>
        <button
          onClick={getCertificate}
          className="w-full rounded-xl bg-[#F47C6A] py-4 text-lg font-medium text-white hover:opacity-90 transition"
        >
          Получить сертификат
        </button>
      </div>
    </div>
  );
};

export default FinishedCourseModal;
