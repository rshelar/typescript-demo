// playwright.config.ts
import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  retries: 0,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000/api',
    trace: 'on-first-retry',
  },
  reporter: [['html', { open: 'never' }]],
});