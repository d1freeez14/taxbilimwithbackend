export interface Material {
  name: string
  src: string
}

export interface Lesson {
  id: number
  moduleNumber: number
  moduleTitle: string
  lessonNumber: number
  lessonTitle: string
  videoSrc: string
  description: string
  materials: Material[]
}