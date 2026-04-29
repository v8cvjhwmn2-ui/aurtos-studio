import { test, expect } from '@playwright/test';

/**
 * Critical path: contact form end-to-end.
 *
 * Mocks /api/contact so we don't actually fire Resend / Make / CAPI.
 * Verifies: validation, honeypot is hidden, submit calls API, success state.
 */
test.describe('Contact form', () => {
  test('blocks empty submit with field errors', async ({ page }) => {
    await page.goto('/contact');
    await page.click('#contact-submit');
    await expect(page.getByText(/at least 2 characters/i)).toBeVisible();
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('honeypot field is hidden from real users', async ({ page }) => {
    await page.goto('/contact');
    const honeypot = page.locator('#website');
    await expect(honeypot).toBeAttached();
    // Off-screen — bounding box should be effectively invisible.
    const box = await honeypot.boundingBox();
    expect(box?.width ?? 0).toBeLessThanOrEqual(2);
  });

  test('successful submit shows thank-you state', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      }),
    );

    await page.goto('/contact');
    await page.fill('#name', 'Playwright Tester');
    await page.fill('#email', 'test@example.com');
    await page.fill('#phone', '9876543210');
    await page.fill('#company', 'Test Co');
    await page.selectOption('#service', 'seo');
    await page.fill('#message', 'This is a Playwright end-to-end test of the contact form.');
    await page.click('#contact-submit');

    await expect(
      page.getByRole('heading', { name: /thank you/i }),
    ).toBeVisible({ timeout: 5000 });
  });
});
