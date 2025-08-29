import { chromium } from 'playwright';
import { Target } from '@qa-playwright/shared';
import { logger } from './logger';

// Define constants locally to avoid import issues
const MAX_LINKS_TO_CHECK = 100;

export async function runTest(target: Target, templateName: string) {
  logger.info(`Running test for target: ${target.name} using template: ${templateName}`);
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Dynamically import the template
    const template = await import(`../templates/${templateName}`);
    
    // Run the test
    const result = await template.run({
      page,
      target,
      logger,
      MAX_LINKS_TO_CHECK
    });
    
    logger.info(`Test completed for ${target.name}`);
    return result;
  } catch (error) {
    logger.error(`Test failed for ${target.name}:`, error);
    throw error;
  } finally {
    await browser.close();
  }
}