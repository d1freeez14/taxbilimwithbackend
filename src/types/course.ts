export interface Author {
  name: string
  avatarSrc: string
}

export interface Module {
  title: string
  videoCount: number
  tasksCount: number
  weeksCount: number
}

export interface Course {
  id: number
  bg?: string
  isFavourite?: boolean
  isInCoursesPage?: boolean
  is_sales_leader?: boolean
  is_recorded?: boolean
  imageSrc: string
  title: string
  description: string
  features: string[]
  whatYouLearn: string[]
  modules: Module[]
  price: string
  usersCount: number
  likesCount: number
  author: Author
}