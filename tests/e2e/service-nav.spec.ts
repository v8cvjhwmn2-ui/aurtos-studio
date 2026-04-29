import { test, expect } from '@playwright/test';

const SERVICE_SLUGS = [
  'digital-marketing',
  'branding',
  'website-development',
  'app-development',
  'technical-cloud',
  'aam-advertising',
  'seo',
  'automation',
];

test.describe('Service navigation', () => {
  test('mega-menu opens on hover and links to all 8 services', async ({ page }) => {
    await page.goto('/');
    await page.locator('header').getByRole('button', { name: /services/i }).hover();

    for (const slug of SERVICE_SLUGS) {
      const link = page.locator(`header a[href="/services/${slug}"]`).first();
      await expect(link).toBeVisible();
    }
  });

  test('clicking a service card from home navigates correctly', async ({ page }) => {
    await page.goto('/');
    await page.locator(`#service-card-seo`).scrollIntoViewIfNeeded();
    await page.locator(`#service-card-seo`).click();
    await expect(page).toHaveURL(/\/services\/seo$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/seo/i);
  });

  test('every service detail page returns 200 and has h1', async ({ page }) => {
    for (const slug of SERVICE_SLUGS) {
      const res = await page.goto(`/services/${slug}`);
      expect(res?.status()).toBe(200);
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    }
  });
});
