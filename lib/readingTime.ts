/**
 * Calculate reading time for a blog post
 * Average reading speed: 200-250 words per minute
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;

  // Remove HTML tags and count words
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;

  const minutes = Math.ceil(words / wordsPerMinute);

  if (minutes === 1) {
    return '1 min read';
  }

  return `${minutes} min read`;
}

/**
 * Calculate precise reading time in minutes
 */
export function getReadingTimeMinutes(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
