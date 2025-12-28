import { test, expect } from '@playwright/test';

const SITE_URL = 'https://kreitzer.dev';
const TEST_ARTICLE_SLUG = 'react-hooks-guide';
const TEST_ARTICLE_URL = `${SITE_URL}/blog/${TEST_ARTICLE_SLUG}`;

test.describe('Blog Verification Tests', () => {
  test('Direct article link works and loads correctly', async ({ page }) => {
    await page.goto(TEST_ARTICLE_URL);

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that we're on the correct URL
    expect(page.url()).toBe(TEST_ARTICLE_URL);

    // Verify the article title is visible
    await expect(page.locator('h1')).toContainText('Mastering React Hooks');

    console.log('✅ Direct article link works!');
  });

  test('Markdown content renders properly', async ({ page }) => {
    await page.goto(TEST_ARTICLE_URL);
    await page.waitForLoadState('networkidle');

    // Check for code blocks
    const codeBlocks = page.locator('pre code');
    const codeBlockCount = await codeBlocks.count();
    expect(codeBlockCount).toBeGreaterThan(0);
    console.log(`✅ Found ${codeBlockCount} code blocks`);

    // Check for headings (H2, H3, etc.)
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(0);
    console.log(`✅ Found ${h2Count} H2 headings`);

    // Check for lists
    const lists = await page.locator('ul, ol').count();
    expect(lists).toBeGreaterThan(0);
    console.log(`✅ Found ${lists} lists`);

    // Check for inline code
    const inlineCode = await page.locator('p code').count();
    expect(inlineCode).toBeGreaterThan(0);
    console.log(`✅ Found ${inlineCode} inline code elements`);

    // Check for mermaid diagrams
    const mermaidDiagrams = await page.locator('.mermaid-container, svg[id^="mermaid"]').count();
    if (mermaidDiagrams > 0) {
      console.log(`✅ Found ${mermaidDiagrams} mermaid diagrams`);
    }

    console.log('✅ Markdown content renders properly!');
  });

  test('SEO meta tags are present and correct', async ({ page }) => {
    await page.goto(TEST_ARTICLE_URL);

    // Check title tag
    const title = await page.title();
    expect(title).toContain('Mastering React Hooks');
    expect(title).toContain('Markus Kreitzer');
    console.log(`✅ Title: ${title}`);

    // Check meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description).toContain('React hooks');
    console.log(`✅ Description: ${description}`);

    // Check canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(TEST_ARTICLE_URL);
    console.log(`✅ Canonical URL: ${canonical}`);

    // Check keywords
    const keywords = await page.locator('meta[name="keywords"]').getAttribute('content');
    expect(keywords).toBeTruthy();
    console.log(`✅ Keywords: ${keywords}`);

    console.log('✅ SEO meta tags are present and correct!');
  });

  test('Open Graph tags for social sharing are present', async ({ page }) => {
    await page.goto(TEST_ARTICLE_URL);

    // Check og:title
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain('Mastering React Hooks');
    console.log(`✅ OG Title: ${ogTitle}`);

    // Check og:description
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDescription).toBeTruthy();
    console.log(`✅ OG Description: ${ogDescription}`);

    // Check og:url
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    expect(ogUrl).toBe(TEST_ARTICLE_URL);
    console.log(`✅ OG URL: ${ogUrl}`);

    // Check og:type
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBe('article');
    console.log(`✅ OG Type: ${ogType}`);

    // Check og:site_name
    const ogSiteName = await page.locator('meta[property="og:site_name"]').getAttribute('content');
    expect(ogSiteName).toBeTruthy();
    console.log(`✅ OG Site Name: ${ogSiteName}`);

    // Check article:published_time
    const publishedTime = await page.locator('meta[property="article:published_time"]').getAttribute('content');
    expect(publishedTime).toBeTruthy();
    console.log(`✅ Published Time: ${publishedTime}`);

    console.log('✅ Open Graph tags are present and correct!');
  });

  test('Twitter Card tags are present', async ({ page }) => {
    await page.goto(TEST_ARTICLE_URL);

    // Check twitter:card
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');
    console.log(`✅ Twitter Card: ${twitterCard}`);

    // Check twitter:title
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    expect(twitterTitle).toContain('Mastering React Hooks');
    console.log(`✅ Twitter Title: ${twitterTitle}`);

    // Check twitter:description
    const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content');
    expect(twitterDescription).toBeTruthy();
    console.log(`✅ Twitter Description: ${twitterDescription}`);

    // Check twitter:creator or twitter:site
    const twitterCreator = await page.locator('meta[name="twitter:creator"]').getAttribute('content');
    expect(twitterCreator).toBeTruthy();
    console.log(`✅ Twitter Creator: ${twitterCreator}`);

    console.log('✅ Twitter Card tags are present and correct!');
  });

  test('Structured data (JSON-LD) is present', async ({ page }) => {
    await page.goto(TEST_ARTICLE_URL);

    // Check for JSON-LD script
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toBeTruthy();

    // Parse and validate JSON-LD
    const structuredData = JSON.parse(jsonLd || '{}');
    expect(structuredData['@type']).toBe('BlogPosting');
    expect(structuredData.headline).toContain('Mastering React Hooks');
    expect(structuredData.author).toBeTruthy();
    expect(structuredData.datePublished).toBeTruthy();

    console.log(`✅ Structured Data: ${JSON.stringify(structuredData, null, 2)}`);
    console.log('✅ JSON-LD structured data is present and correct!');
  });

  test('Sitemap is accessible', async ({ page }) => {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    const response = await page.goto(sitemapUrl);

    expect(response?.status()).toBe(200);

    const content = await page.content();
    expect(content).toContain('<?xml');
    expect(content).toContain('<urlset');
    expect(content).toContain(TEST_ARTICLE_URL);

    console.log('✅ Sitemap is accessible and contains blog posts!');
  });

  test('Robots.txt is accessible', async ({ page }) => {
    const robotsUrl = `${SITE_URL}/robots.txt`;
    const response = await page.goto(robotsUrl);

    expect(response?.status()).toBe(200);

    const content = await page.textContent('body');
    expect(content).toContain('User-agent');
    expect(content).toContain('Allow: /');
    expect(content).toContain('sitemap');

    console.log('✅ Robots.txt is accessible and configured correctly!');
  });
});
