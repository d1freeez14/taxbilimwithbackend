import {IconMain} from "@/shared/icons/IconMain";
import {IconCourses} from "@/shared/icons/IconCourses";
import {IconMyEducation} from "@/shared/icons/IconMyEducation";
import {IconCertificate} from "@/shared/icons/IconCertificate";

export const guestRoutes = [
  {
    icon: 'hugeicons:dashboard-square-02',
    label: "Главная",
    href: "/",
  },
  {
    icon: 'ph:book-open-text',
    label: "Все курсы",
    href: "/courses",
  },
  {
    icon: 'mdi:education-outline',
    label: "Мое обучение",
    href: "/myEducation",
  },
  {
    icon: 'ph:certificate-light',
    label: "Мои сертификаты",
    href: "/myCertificates",
  },
];
