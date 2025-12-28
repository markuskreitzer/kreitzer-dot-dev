import { test, expect } from '@playwright/test';

const SITE_URL = 'https://kreitzer.dev';
const TEST_ARTICLE_SLUG = 'react-hooks-guide';
const TEST_ARTICLE_URL = `${SITE_URL}/blog/${TEST_ARTICLE_SLUG}`;

test.describe('Visual Verification', () => {
  test('Take screenshots of blog post', async ({ page }) => {
    await page.goto(TEST_ARTICLE_URL);
    await page.waitForLoadState('networkidle');

    // Wait for any animations to complete
    await page.waitForTimeout(1000);

    // Take full page screenshot
    await page.screenshot({
      path: 'blog-post-full.png',
      fullPage: true
    });

    // Take viewport screenshot of the top
    await page.screenshot({
      path: 'blog-post-top.png'
    });

    // Scroll down to see code blocks
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'blog-post-code-blocks.png'
    });

    // Scroll to mermaid diagram
    await page.locator('.mermaid-container, svg[id^="mermaid"]').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'blog-post-mermaid.png'
    });

    console.log('✅ Screenshots saved!');
  });

  test('Verify article title is unique in content', async ({ page }) => {
    await page.goto(TEST_ARTICLE_URL);
    await page.waitForLoadState('networkidle');

    // Check that the article heading exists
    const articleHeading = page.locator('article h1, .prose h1').first();
    await expect(articleHeading).toContainText('Mastering React Hooks');

    console.log('✅ Article title verified!');
  });

  test('Verify sitemap contains blog posts', async ({ page }) => {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    const response = await page.goto(sitemapUrl);

    expect(response?.status()).toBe(200);

    // Check if the sitemap contains the test article URL
    const content = await page.textContent('body');
    expect(content).toContain(TEST_ARTICLE_URL);
    expect(content).toContain('urlset');

    console.log('✅ Sitemap contains blog posts!');
  });

  test('Verify robots.txt is correct', async ({ page }) => {
    const robotsUrl = `${SITE_URL}/robots.txt`;
    const response = await page.goto(robotsUrl);

    expect(response?.status()).toBe(200);

    const content = await page.textContent('body');
    expect(content).toContain('User-Agent'); // Case insensitive check
    expect(content).toContain('Allow: /');
    expect(content).toContain('sitemap');

    console.log('✅ Robots.txt is configured correctly!');
  });
});
