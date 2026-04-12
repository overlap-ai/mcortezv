export interface Paper {
  slug: string
  title: string
  abstract: string
  category: string
  categoryColor: string
  tags: string[]
  date: string
  readingTime: string
  status: 'published' | 'draft' | 'in-progress'
  citations: number
  downloads: number
  content: string
}

export interface TechItem {
  name: string
  category: 'Language' | 'Framework' | 'AI/ML' | 'Database' | 'Infrastructure' | 'Tool'
  level: 'core' | 'proficient' | 'familiar'
  description: string
}

export interface Project {
  name: string
  description: string
  url: string
  tags: string[]
  status: 'live' | 'beta' | 'wip'
  highlight?: string
}

export interface Achievement {
  title: string
  issuer: string
  date: string
  description: string
  type: 'certification' | 'award' | 'program'
}
