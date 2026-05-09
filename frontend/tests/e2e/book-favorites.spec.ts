// import { expect, test, type Page } from '@playwright/test';
import { type Page } from '@playwright/test';

test.describe('Book Favorites App', () => {
  const registrationUser = {
    username: `e2e-register-${Date.now()}`,
    password: `e2e-pass-${Date.now()}`,
  };
  const existingUser = {
    username: `e2e-login-${Date.now()}`,
    password: `e2e-pass-${Date.now()}-login`,
  };

  test.beforeAll(async ({ request }) => {
    const response = await request.post('/api/register', {
      data: existingUser,
      failOnStatusCode: false,
    });

    expect([201, 409]).toContain(response.status());
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('allows a new user to register and login', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.locator('input[name="username"]').fill(registrationUser.username);
    await page.locator('input[name="password"]').fill(registrationUser.password);
    await page.locator('button#register').click();

    await expect(page.getByText('Registration successful! You can now log in.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible({ timeout: 4000 });

    await page.locator('input[name="username"]').fill(registrationUser.username);
    await page.locator('input[name="password"]').fill(registrationUser.password);
    await page.locator('button#login').click();

    await expect(page.getByText(`Hi, ${registrationUser.username}`)).toBeVisible();
    await expect(page.locator('a#favorites-link')).toBeVisible();
  });

  test('shows books and allows adding one to favorites', async ({ page }) => {
    await login(page, existingUser.username, existingUser.password);
    await page.locator('a#books-link').click();
    await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible();

    const firstBook = page.locator('[class*="bookCard"]').first();
    const firstBookTitle = await firstBook.locator('[class*="bookTitle"]').innerText();
    await firstBook.getByRole('button', { name: 'Add to Favorites' }).click();

    await page.locator('a#favorites-link').click();
    await expect(page.getByRole('heading', { name: 'My Favorite Books' })).toBeVisible();
    await expect(page.getByText(firstBookTitle, { exact: true })).toBeVisible();
  });

  test('logs out and protects routes', async ({ page, baseURL }) => {
    await login(page, existingUser.username, existingUser.password);
    await page.locator('button#logout').click();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    await page.goto('/books');
    await expect(page).toHaveURL(new URL('/', baseURL ?? 'http://localhost:5173').toString());
  });
});

async function login(page: Page, username: string, password: string): Promise<void> {
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button#login').click();
  await expect(page.getByText(`Hi, ${username}`)).toBeVisible();
}