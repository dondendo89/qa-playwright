import { chromium } from 'playwright';
import { prisma } from '../../../../infra/prisma/client';
import { logger } from './logger';
import { uploadArtifact } from './storage';
import { sendNotifications } from './notifications';
import { RunStatus, ArtifactType } from '@qa-playwright/shared';
import { validateEnv } from '@qa-playwright/shared';

const env = validateEnv();

/**
 * Esegue uno scenario Playwright
 */
export async function runScenario(scenarioId: string) {
  logger.info({ scenarioId }, 'Starting scenario execution');

  // Recupera lo scenario dal database
  const scenario = await prisma.scenario.findUnique({
    where: { id: scenarioId },
    include: { target: true },
  });

  if (!scenario) {
    throw new Error(`Scenario not found: ${scenarioId}`);
  }

  // Crea un record di esecuzione
  const run = await prisma.run.create({
    data: {
      scenarioId: scenario.id,
      status: RunStatus.RUNNING,
      startedAt: new Date(),
    },
  });

  logger.info({ runId: run.id, scenarioId }, 'Created run record');

  // Prepara le variabili per l'esecuzione
  let browser = null;
  let context = null;
  let page = null;
  let success = false;
  let error = null;
  let artifacts = [];
  let counters = {
    pageErrors: 0,
    consoleErrors: 0,
    brokenLinks: 0,
    assertions: 0,
    assertionsPassed: 0,
  };

  const startTime = Date.now();

  try {
    // Avvia il browser
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    // Configura gli handler per gli errori
    page.on('pageerror', (err) => {
      logger.error({ runId: run.id, error: err.message }, 'Page error');
      counters.pageErrors++;
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        logger.error({ runId: run.id, message: msg.text() }, 'Console error');
        counters.consoleErrors++;
      }
    });

    // Prepara il contesto di esecuzione per lo scenario
    const scenarioContext = {
      page,
      browser,
      context,
      target: scenario.target,
      logger: logger.child({ runId: run.id }),
      MAX_LINKS_TO_CHECK: env.MAX_LINKS_TO_CHECK,
    };

    // Esegui il codice dello scenario
    const scenarioFunction = new Function('return ' + scenario.code)();
    const result = await Promise.race([
      scenarioFunction(scenarioContext),
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Scenario execution timed out after ${env.PLAYWRIGHT_TIMEOUT_MS}ms`));
        }, env.PLAYWRIGHT_TIMEOUT_MS);
      }),
    ]);

    // Cattura uno screenshot finale
    const screenshot = await page.screenshot({ fullPage: true });
    const screenshotPath = await uploadArtifact({
      buffer: screenshot,
      filename: `${run.id}/screenshot.png`,
      contentType: 'image/png',
    });

    artifacts.push({
      runId: run.id,
      type: ArtifactType.SCREENSHOT,
      path: screenshotPath,
      size: screenshot.length,
    });

    // Aggiorna i contatori con i risultati
    if (result && typeof result === 'object') {
      if (result.brokenLinks) counters.brokenLinks = result.brokenLinks;
      if (result.assertions) counters.assertions = result.assertions;
      if (result.assertionsPassed) counters.assertionsPassed = result.assertionsPassed;
    }

    success = true;
  } catch (err) {
    error = err.message;
    logger.error({ runId: run.id, error }, 'Scenario execution failed');
  } finally {
    // Chiudi il browser
    if (page) await page.close().catch(() => {});
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }

  const endTime = Date.now();
  const duration = endTime - startTime;

  // Salva gli artifact nel database
  if (artifacts.length > 0) {
    await prisma.artifact.createMany({
      data: artifacts,
    });
  }

  // Aggiorna il record di esecuzione
  const updatedRun = await prisma.run.update({
    where: { id: run.id },
    data: {
      status: success ? RunStatus.COMPLETED : RunStatus.FAILED,
      completedAt: new Date(),
      duration,
      error,
      counters,
    },
  });

  logger.info(
    { runId: run.id, duration, success },
    'Scenario execution completed'
  );

  // Invia notifiche in caso di fallimento
  if (!success) {
    await sendNotifications(updatedRun, scenario);
  }

  return {
    runId: run.id,
    success,
    duration,
    error,
    counters,
  };
}