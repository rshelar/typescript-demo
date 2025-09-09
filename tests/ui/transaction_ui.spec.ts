import { test, expect } from '@playwright/test';

test('should create a transaction via UI', async ({ page, request }) => {
  // Create sender
  const user1 = await request.post('http://localhost:3000/api/users', {
    data: {
      name: 'JohnSender',
      email: 'johnsender@example.com',
      accountType: 'basic',
    },
  });
  const sender = await user1.json();

  // Create recipient
  const user2 = await request.post('http://localhost:3000/api/users', {
    data: {
      name: 'JaneReceiver',
      email: 'janereceiver@example.com',
      accountType: 'premium',
    },
  });
  const recipient = await user2.json();

  // Now test the UI
  await page.goto('http://localhost:3000/transactions_crud.html');

  await page.fill('#userId', sender.userId);
  await page.fill('#recipientId', recipient.userId);
  await page.fill('#amount', '50');
  await page.selectOption('#type', 'transfer');
  await page.click('button[type="submit"]');

  await expect(page.locator('#status')).toContainText('Success');
});