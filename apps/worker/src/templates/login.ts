import { Target } from '@qa-playwright/shared';
import { Page } from 'playwright';
import { logger } from '../lib/logger';

interface RunParams {
  page: Page;
  target: Target;
  logger: typeof logger;
}

export async function run({ page, target, logger }: RunParams) {
  // Get parameters from environment variables or use defaults
  const params = {
    loginUrl: process.env.LOGIN_URL || target.url,
    usernameSelector: process.env.USERNAME_SELECTOR || 'input[type="email"]',
    passwordSelector: process.env.PASSWORD_SELECTOR || 'input[type="password"]',
    submitSelector: process.env.SUBMIT_SELECTOR || 'button[type="submit"]',
    username: process.env.TEST_USERNAME || 'test@example.com',
    password: process.env.TEST_PASSWORD || 'password',
    successSelector: process.env.SUCCESS_SELECTOR || 'h1',
  };

  // Navigate to the login page
  await page.goto(params.loginUrl);
  logger.info(`Navigated to login page: ${params.loginUrl}`);

  // Fill in the login form
  await page.fill(params.usernameSelector, params.username);
  await page.fill(params.passwordSelector, params.password);

  // Submit the form
  await page.click(params.submitSelector);
  logger.info('Submitted login form');

  // Wait for navigation to complete
  await page.waitForLoadState('networkidle');

  // Check if login was successful
  const loginSuccess = await page.isVisible(params.successSelector);

  // Take a screenshot
  await page.screenshot({ path: 'login-result.png', fullPage: true });

  // Return the test results
  return {
    loginSuccess,
    jsErrors: [],
    assertions: ['Login should succeed'],
    assertionsPassed: loginSuccess
  };
}