export interface EnrichedProfile {
  name: string
  email: string
  headline: string
  company: string
  location: string
  bio: string
  profileImage: string
  socials: {
    linkedin: string
    github: string
    twitter: string
    website?: string
  }
  skills: string[]
  workHistory: Array<{
    company: string
    title: string
    duration: string
  }>
  githubStats: {
    repos: number
    stars: number
    followers: number
  }
  summary: string
}

export interface EnrichmentRequest {
  name: string
  email: string
}