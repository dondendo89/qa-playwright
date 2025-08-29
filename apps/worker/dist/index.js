import { logger } from './lib/logger';
import { setupScheduler } from './lib/scheduler';
async function main() {
    logger.info('Starting QA Playwright worker...');
    try {
        await setupScheduler();
        logger.info('Scheduler setup complete');
    }
    catch (error) {
        logger.error('Failed to start worker:', error);
        process.exit(1);
    }
}
main();
