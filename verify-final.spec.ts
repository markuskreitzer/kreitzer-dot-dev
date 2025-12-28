import { test } from '@playwright/test';

const SITE_URL = 'https://kreitzer.dev';
const TEST_ARTICLE_URL = `${SITE_URL}/blog/react-hooks-guide`;

test.describe('Final Visual Verification', () => {
  test('Capture updated blog post styling', async ({ page }) => {
    await page.goto(TEST_ARTICLE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for fonts and styles to load

    // Full page screenshot
    await page.screenshot({
      path: 'final-blog-post-full.png',
      fullPage: true
    });

    // Top of page
    await page.screenshot({
      path: 'final-blog-post-top.png'
    });

    // Scroll to code blocks
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'final-blog-post-code-blocks.png'
    });

    // Scroll to headings and lists
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'final-blog-post-content.png'
    });

    console.log('✅ Screenshots captured successfully!');
    console.log('📸 Check:');
    console.log('  - final-blog-post-top.png');
    console.log('  - final-blog-post-code-blocks.png');
    console.log('  - final-blog-post-content.png');
    console.log('  - final-blog-post-full.png');
  });
});
