const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 30000,
  },
  use: {
    baseURL: 'https://qa-task.demo.kramp.com/shop-nl/nl',
    httpCredentials: {
      username: 'feature-demo',
      password: 'demo',
    },
    headless: false,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});