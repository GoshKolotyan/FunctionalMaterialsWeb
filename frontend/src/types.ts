// Mirrors backend/app/models.py
export type MemberGroup = 'pi' | 'staff' | 'postdoc' | 'phd' | 'student' | 'assistant' | 'alumni'

export interface Member {
  id: number
  name: string
  role: string
  group: MemberGroup
  education: string
  bio: string
  photo: string
  email: string
  orcid: string
  order: number
}

export interface ResearchArea {
  id: number
  title: string
  summary: string
  image: string
  order: number
}

export interface Publication {
  id: number
  title: string
  authors: string
  venue: string
  year: number
  doi: string
  url: string
  featured: boolean
}

export interface NewsPost {
  id: number
  slug: string
  title: string
  date: string // ISO yyyy-mm-dd
  category: string
  summary: string
  body: string
}

export interface Page {
  slug: string
  title: string
  lead: string
  body: string
}

export interface SiteInfo {
  name: string
  tagline: string
  description: string
  organization: string
  address: string
  email: string
  phone: string
  hours: string
  facebook: string
  linkedin: string
}
