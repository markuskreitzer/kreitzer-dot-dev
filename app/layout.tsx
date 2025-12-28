import type { Metadata } from 'next'
import './globals.css'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: {
    default: siteConfig.site.title,
    template: `%s | ${siteConfig.site.title}`,
  },
  description: siteConfig.site.description,
  generator: 'Next.js',
  metadataBase: new URL(siteConfig.site.url),
  authors: [{ name: siteConfig.user.name }],
  creator: siteConfig.user.name,
  publisher: siteConfig.user.name,
  keywords: ['software engineer', 'web development', 'full-stack', 'blog', 'portfolio'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.site.url,
    title: siteConfig.site.title,
    description: siteConfig.site.description,
    siteName: siteConfig.site.title,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.site.title,
    description: siteConfig.site.description,
    creator: siteConfig.contact.twitter || '@markuskreitzer',
    site: siteConfig.contact.twitter || '@markuskreitzer',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
