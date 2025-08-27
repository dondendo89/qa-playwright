import { Worker } from 'bullmq';
import { validateEnv } from '@qa-playwright/shared';
import { createRedisConnection } from './lib/redis';
import { logger } from './lib/logger';
import { runScenario } from './lib/runner';
import { startScheduler } from './lib/scheduler';

// Valida le variabili d'ambiente
const env = validateEnv();

// Crea la connessione Redis
const redisConnection = createRedisConnection();

// Configura il worker BullMQ
const worker = new Worker(
  'scenarios',
  async (job) => {
    logger.info({ jobId: job.id }, `Processing job: ${job.name}`);
    
    const { scenarioId } = job.data;
    
    try {
      const result = await runScenario(scenarioId);
      logger.info({ jobId: job.id, scenarioId }, 'Job completed successfully');
      return result;
    } catch (error) {
      logger.error({ jobId: job.id, scenarioId, error }, 'Job failed');
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: env.WORKER_CONCURRENCY,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 100 },
  }
);

worker.on('completed', (job) => {
  logger.info({ jobId: job.id }, `Job ${job.id} completed`);
});

worker.on('failed', (job, error) => {
  logger.error({ jobId: job?.id, error }, `Job ${job?.id} failed`);
});

// Avvia lo scheduler interno
startScheduler();

// Gestione della terminazione
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing worker...');
  await worker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, closing worker...');
  await worker.close();
  process.exit(0);
});

logger.info(
  { concurrency: env.WORKER_CONCURRENCY },
  'Worker started successfully'
);