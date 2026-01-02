/**
 * Analytics Setup Placeholder
 *
 * To add analytics, uncomment and configure one of the following:
 *
 * 1. Google Analytics:
 *    - Add NEXT_PUBLIC_GA_MEASUREMENT_ID to .env.local
 *    - Install: npm install @next/third-parties
 *    - Add GoogleAnalytics component to layout
 *
 * 2. Plausible Analytics (privacy-focused):
 *    - Add NEXT_PUBLIC_PLAUSIBLE_DOMAIN to .env.local
 *    - Add script tag to layout
 *
 * 3. Vercel Analytics:
 *    - Install: npm install @vercel/analytics
 *    - Add Analytics component to layout
 */

// Example Google Analytics pageview tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Example event tracking
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
