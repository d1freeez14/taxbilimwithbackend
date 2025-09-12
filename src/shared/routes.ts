export const guestRoutes = [
  {
    icon: 'hugeicons:dashboard-square-02',
    label: "Главная",
    href: "/dashboard",
  },
  {
    icon: 'ph:book-open-text',
    label: "Все курсы",
    href: "/dashboard/courses",
  },
  {
    icon: 'mdi:education-outline',
    label: "Мое обучение",
    href: "/dashboard/myEducation",
  },
  {
    icon: 'ph:certificate-light',
    label: "Мои сертификаты",
    href: "/dashboard/myCertificates",
  },
];

export const teacherRoutes = [
  {
    icon: 'hugeicons:dashboard-square-02',
    label: "Главная",
    href: "/teacher/dashboard",
  },
  {
    icon: 'ph:book-open-text',
    label: "Курсы",
    href: "/teacher/courses",
  },
  {
    icon: 'hugeicons:student',
    label: "Студенты",
    href: "/teacher/students",
  },
  {
    icon: 'octicon:graph-24',
    label: "Продажи",
    href: "/teacher/sales",
  },
]