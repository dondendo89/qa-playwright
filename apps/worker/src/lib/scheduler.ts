import { Queue } from 'bullmq';
import * as cronParser from 'cron-parser';
import { prisma } from '../../../../infra/prisma/client';
import { createRedisConnection } from './redis';
import { logger } from './logger';
import { SCHEDULER_POLL_INTERVAL } from '@qa-playwright/shared';

// Crea la coda BullMQ
const scenariosQueue = new Queue('scenarios', {
  connection: createRedisConnection(),
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: true,
    removeOnFail: false,
  },
});

/**
 * Verifica se uno scenario deve essere eseguito in base alla sua pianificazione cron
 */
function shouldRunScenario(cronExpression: string): boolean {
  try {
    const interval = cronParser.parseExpression(cronExpression);
    const prev = interval.prev().toDate();
    const now = new Date();
    
    // Verifica se l'ultima esecuzione prevista è avvenuta negli ultimi 30 secondi
    const diffSeconds = (now.getTime() - prev.getTime()) / 1000;
    return diffSeconds <= 30;
  } catch (error) {
    logger.error({ error, cronExpression }, 'Error parsing cron expression');
    return false;
  }
}

/**
 * Pianifica l'esecuzione degli scenari attivi
 */
async function scheduleScenarios() {
  try {
    // Recupera tutti gli scenari attivi
    const activeScenarios = await prisma.scenario.findMany({
      where: {
        isActive: true,
      },
      include: {
        target: true,
      },
    });

    logger.info({ count: activeScenarios.length }, 'Found active scenarios');

    // Verifica quali scenari devono essere eseguiti
    for (const scenario of activeScenarios) {
      if (shouldRunScenario(scenario.schedule)) {
        // Verifica se c'è già un job in coda o in esecuzione per questo scenario
        const jobs = await scenariosQueue.getJobs(['waiting', 'active', 'delayed']);
        const existingJob = jobs.find(job => job.data.scenarioId === scenario.id);

        if (!existingJob) {
          // Crea un nuovo job per l'esecuzione dello scenario
          await scenariosQueue.add(
            `scenario:${scenario.id}`,
            {
              scenarioId: scenario.id,
              targetUrl: scenario.target.url,
            },
            {
              jobId: `scenario:${scenario.id}:${Date.now()}`,
            }
          );

          logger.info(
            { scenarioId: scenario.id, schedule: scenario.schedule },
            'Scheduled scenario execution'
          );
        }
      }
    }
  } catch (error) {
    logger.error({ error }, 'Error scheduling scenarios');
  }
}

/**
 * Avvia lo scheduler interno
 */
export function startScheduler() {
  // Esegui immediatamente la prima pianificazione
  scheduleScenarios();

  // Pianifica l'esecuzione periodica
  const intervalId = setInterval(scheduleScenarios, SCHEDULER_POLL_INTERVAL);

  logger.info(
    { pollIntervalMs: SCHEDULER_POLL_INTERVAL },
    'Scheduler started successfully'
  );

  // Restituisci una funzione per fermare lo scheduler
  return () => {
    clearInterval(intervalId);
    logger.info('Scheduler stopped');
  };
}

// Esporta la coda per l'uso in altri moduli
export { scenariosQueue };