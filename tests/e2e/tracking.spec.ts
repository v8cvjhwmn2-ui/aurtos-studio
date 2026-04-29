import { test, expect } from '@playwright/test';

/**
 * Verifies that WhatsApp + phone clicks fire the right tracking events
 * via window.dataLayer (GTM). We capture dataLayer.push calls before
 * navigation so events are recorded regardless of GTM script load timing.
 */
test.describe('Tracking events', () => {
  test.beforeEach(async ({ page, context }) => {
    // Block external popup nav from wa.me / tel: clicks.
    await context.route('https://wa.me/**', (route) => route.abort());

    await page.addInitScript(() => {
      // @ts-expect-error - extending window for test
      window.__events = [];
      const dl: Array<Record<string, unknown>> = [];
      const handler: ProxyHandler<typeof dl> = {
        get(target, prop) {
          if (prop === 'push') {
            return (...args: Record<string, unknown>[]) => {
              for (const a of args) {
                // @ts-expect-error - capture
                window.__events.push(a);
              }
              return target.push(...args);
            };
          }
          return Reflect.get(target, prop);
        },
      };
      // @ts-expect-error - assign proxied dataLayer
      window.dataLayer = new Proxy(dl, handler);
    });
  });

  async function getEvents(page: import('@playwright/test').Page) {
    return page.evaluate(
      () =>
        // @ts-expect-error - read captured events
        window.__events as Array<Record<string, unknown>>,
    );
  }

  test('floating WhatsApp button fires whatsapp_click', async ({ page }) => {
    await page.goto('/');
    // FloatingWhatsApp lives in layout — present on every page.
    const fab = page.getByRole('link', { name: /chat on whatsapp/i }).last();
    await fab.click();
    const events = await getEvents(page);
    const hit = events.find((e) => e.event === 'whatsapp_click');
    expect(hit, 'whatsapp_click event should fire').toBeTruthy();
  });

  test('CTA section phone link fires phone_click', async ({ page }) => {
    await page.goto('/');
    const phoneLink = page.locator('a[href^="tel:"]').first();
    await phoneLink.scrollIntoViewIfNeeded();
    await phoneLink.click();
    const events = await getEvents(page);
    const hit = events.find((e) => e.event === 'phone_click');
    expect(hit, 'phone_click event should fire').toBeTruthy();
  });

  test('hero CTA click fires cta_click with click_location=hero', async ({ page }) => {
    await page.goto('/');
    await page.locator('#hero-cta-primary').click();
    await expect(page).toHaveURL(/\/contact/);
    const events = await getEvents(page);
    const hit = events.find(
      (e) =>
        e.event === 'cta_click' &&
        (e as { click_location?: string }).click_location === 'hero',
    );
    expect(hit, 'cta_click with click_location=hero should fire').toBeTruthy();
  });

  test('service card click fires service_card_click', async ({ page }) => {
    await page.goto('/');
    await page.locator('#service-card-seo').scrollIntoViewIfNeeded();
    await page.locator('#service-card-seo').click();
    await expect(page).toHaveURL(/\/services\/seo$/);
    const events = await getEvents(page);
    const hit = events.find((e) => e.event === 'service_card_click');
    expect(hit, 'service_card_click should fire').toBeTruthy();
  });
});
