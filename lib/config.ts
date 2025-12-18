/**
 * Site configuration - can be customized via environment variables
 */

export interface SiteConfig {
  user: {
    name: string
    title: string
    description: string
  }
  contact: {
    github: string
    linkedin: string
    twitter?: string
    email?: string
  }
  site: {
    title: string
    description: string
    chatUrl: string
  }
}

// Environment variables with fallbacks
const USER_NAME = process.env.NEXT_PUBLIC_USER_NAME || 'Markus Kreitzer'
const USER_TITLE = process.env.NEXT_PUBLIC_USER_TITLE || 'Software Engineer'
const USER_DESCRIPTION = process.env.NEXT_PUBLIC_USER_DESCRIPTION || 
  "I'm a passionate Software Engineer specializing in building robust and scalable web applications. I love turning complex problems into elegant, efficient code. I'm particularly interested in Full-Stack Development, Cloud Technologies, and Machine Learning."

const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/markuskreitzer'
const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/markuskreitzer'
const TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER_URL || undefined
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || undefined

const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE || `${USER_NAME} - ${USER_TITLE}`
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 
  `Personal portfolio and blog of ${USER_NAME}, a passionate ${USER_TITLE}`
const CHAT_URL = process.env.NEXT_PUBLIC_CHAT_URL || 'https://chat.kreitzer.dev'

export const siteConfig: SiteConfig = {
  user: {
    name: USER_NAME,
    title: USER_TITLE,
    description: USER_DESCRIPTION
  },
  contact: {
    github: GITHUB_URL,
    linkedin: LINKEDIN_URL,
    twitter: TWITTER_URL,
    email: EMAIL
  },
  site: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    chatUrl: CHAT_URL
  }
}

// Utility functions for easier imports
export const getUserName = () => siteConfig.user.name
export const getUserTitle = () => siteConfig.user.title  
export const getUserDescription = () => siteConfig.user.description
export const getSiteTitle = () => siteConfig.site.title
export const getSiteDescription = () => siteConfig.site.description

export default siteConfig