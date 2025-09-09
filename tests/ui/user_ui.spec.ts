import { test, expect } from '@playwright/test';

test.describe('User CRUD UI', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/user_crud.html');
  });

  test('should render create user form and table', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('User Management');
    await expect(page.locator('form#user-form')).toBeVisible();
    await expect(page.locator('table#user-table')).toBeVisible();
  });

  test('should create a user and display in All Users table', async ({ page }) => {
    const name = `Alice_${Date.now()}`; // unique name
    const email = `${name.toLowerCase()}@test.com`;

    await page.fill('#name', name);
    await page.fill('#email', email);
    await page.selectOption('#accountType', 'basic');
    await page.click('button:has-text("Create User")');

    await page.waitForTimeout(500); // allow server response

    const row = page.locator(`#user-table tbody tr`, { hasText: name });
    await expect(row).toContainText(name);
    await expect(row).toContainText(email);
    await expect(row).toContainText('basic');
  });

  test('should fetch a user by ID and display in box', async ({ page }) => {
    // 1. Create a user
    const name = 'Bob Fetch';
    const email = `bob_${Date.now()}@test.com`;

    await page.fill('#name', name);
    await page.fill('#email', email);
    await page.selectOption('#accountType', 'premium');
    await page.click('button:has-text("Create User")');

    await page.waitForTimeout(500);
    const userIdCell = await page.locator('#user-table tbody tr:last-child td:first-child').innerText();

    // 2. Fetch by ID
    await page.fill('#get-user-id', userIdCell);
    await page.click('#get-user-form button');

    await page.waitForSelector('#get-user-result');
    const text = await page.locator('#get-user-result').innerText();
    expect(text).toContain(name);
    expect(text).toContain(email);
  });
});