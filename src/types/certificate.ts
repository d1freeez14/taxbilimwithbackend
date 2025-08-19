export interface Author {
  name: string
  avatarSrc: string
}

export interface Certificate {
  id: number
  imageSrc: string
  author: Author
  category: string
  courseTitle: string
  dateReceived: string
}