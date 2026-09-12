export interface SiteConfig {
  user: {
    name: string;
    title: string;
    description: string;
  };
  contact: {
    github: string;
    linkedin: string;
    twitter?: string;
    email?: string;
  };
  site: {
    title: string;
    description: string;
    chatUrl: string;
    url: string;
  };
}

const USER_NAME = process.env.NEXT_PUBLIC_USER_NAME || "Markus Kreitzer";
const USER_TITLE =
  process.env.NEXT_PUBLIC_USER_TITLE || "AI & Platform Engineer";
const USER_DESCRIPTION =
  process.env.NEXT_PUBLIC_USER_DESCRIPTION ||
  "I work on AI applications and developer tooling at PeopleTec in Huntsville, Alabama, and am pursuing a PhD in electrical engineering at Auburn.";

const GITHUB_URL =
  process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/markuskreitzer";
const LINKEDIN_URL =
  process.env.NEXT_PUBLIC_LINKEDIN_URL ||
  "https://linkedin.com/in/markuskreitzer";
const TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER_URL || undefined;
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || undefined;

const SITE_TITLE =
  process.env.NEXT_PUBLIC_SITE_TITLE || `${USER_NAME} - ${USER_TITLE}`;
const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  "Software projects, electronics, and technical articles by Markus Kreitzer.";
const CHAT_URL =
  process.env.NEXT_PUBLIC_CHAT_URL || "https://chat.kreitzer.dev";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kreitzer.dev";

export const siteConfig: SiteConfig = {
  user: {
    name: USER_NAME,
    title: USER_TITLE,
    description: USER_DESCRIPTION,
  },
  contact: {
    github: GITHUB_URL,
    linkedin: LINKEDIN_URL,
    twitter: TWITTER_URL,
    email: EMAIL,
  },
  site: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    chatUrl: CHAT_URL,
    url: SITE_URL,
  },
};

export const getUserName = () => siteConfig.user.name;
export const getUserTitle = () => siteConfig.user.title;
export const getUserDescription = () => siteConfig.user.description;
export const getSiteTitle = () => siteConfig.site.title;
export const getSiteDescription = () => siteConfig.site.description;

export default siteConfig;
