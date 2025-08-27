import nodemailer from 'nodemailer';
import { prisma } from '../../../../infra/prisma/client';
import { validateEnv } from '@qa-playwright/shared';
import { logger } from './logger';
import { NotificationType, NotificationStatus } from '@qa-playwright/shared';
import type { Run, Scenario } from '@qa-playwright/shared';

const env = validateEnv();

// Configura il trasporto SMTP
const smtpTransport = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

/**
 * Invia una notifica email
 */
async function sendEmailNotification(run: any, scenario: any, user: any) {
  try {
    // Crea un record di notifica
    const notification = await prisma.notification.create({
      data: {
        runId: run.id,
        type: NotificationType.EMAIL,
        status: NotificationStatus.PENDING,
      },
    });

    // Prepara il contenuto dell'email
    const subject = `Scenario Failed: ${scenario.name}`;
    const text = `
Il tuo scenario "${scenario.name}" è fallito durante l'esecuzione.

Dettagli:
- Progetto: ${scenario.project.name}
- Target: ${scenario.target.name} (${scenario.target.url})
- Errore: ${run.error || 'Nessun errore specifico'}
- Data: ${run.completedAt}

Puoi visualizzare i dettagli completi nella dashboard:
${env.APP_URL}/dashboard/projects/${scenario.projectId}/scenarios/${scenario.id}/runs/${run.id}
`;

    // Invia l'email
    await smtpTransport.sendMail({
      from: env.SMTP_FROM,
      to: user.email,
      subject,
      text,
    });

    // Aggiorna il record di notifica
    await prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: NotificationStatus.SENT,
        sentAt: new Date(),
      },
    });

    logger.info(
      { notificationId: notification.id, email: user.email },
      'Email notification sent successfully'
    );

    return true;
  } catch (error) {
    logger.error({ error }, 'Failed to send email notification');
    return false;
  }
}

/**
 * Invia una notifica Slack
 */
async function sendSlackNotification(run: any, scenario: any) {
  // Verifica se è configurato il webhook Slack
  if (!env.SLACK_WEBHOOK_URL) {
    logger.info('Slack webhook URL not configured, skipping notification');
    return false;
  }

  try {
    // Crea un record di notifica
    const notification = await prisma.notification.create({
      data: {
        runId: run.id,
        type: NotificationType.SLACK,
        status: NotificationStatus.PENDING,
      },
    });

    // Prepara il payload per Slack
    const payload = {
      text: `⚠️ Scenario Failed: ${scenario.name}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `⚠️ Scenario Failed: ${scenario.name}`,
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Project:*\n${scenario.project.name}`,
            },
            {
              type: 'mrkdwn',
              text: `*Target:*\n${scenario.target.name}`,
            },
            {
              type: 'mrkdwn',
              text: `*URL:*\n${scenario.target.url}`,
            },
            {
              type: 'mrkdwn',
              text: `*Time:*\n${new Date(run.completedAt).toLocaleString()}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Error:*\n${run.error || 'No specific error'}`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Details',
                emoji: true,
              },
              url: `${env.APP_URL}/dashboard/projects/${scenario.projectId}/scenarios/${scenario.id}/runs/${run.id}`,
            },
          ],
        },
      ],
    };

    // Invia la notifica a Slack
    const response = await fetch(env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`);
    }

    // Aggiorna il record di notifica
    await prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: NotificationStatus.SENT,
        sentAt: new Date(),
      },
    });

    logger.info(
      { notificationId: notification.id },
      'Slack notification sent successfully'
    );

    return true;
  } catch (error) {
    logger.error({ error }, 'Failed to send Slack notification');
    return false;
  }
}

/**
 * Invia notifiche per un run fallito
 */
export async function sendNotifications(run: any, scenario: any) {
  try {
    // Carica i dati necessari
    const fullScenario = await prisma.scenario.findUnique({
      where: { id: scenario.id },
      include: {
        project: true,
        target: true,
      },
    });

    if (!fullScenario) {
      throw new Error(`Scenario not found: ${scenario.id}`);
    }

    const user = await prisma.user.findUnique({
      where: { id: fullScenario.project.userId },
    });

    if (!user) {
      throw new Error(`User not found for project: ${fullScenario.projectId}`);
    }

    // Verifica se è già stata inviata una notifica per questo run
    const existingNotifications = await prisma.notification.findMany({
      where: {
        runId: run.id,
        status: NotificationStatus.SENT,
      },
    });

    if (existingNotifications.length > 0) {
      logger.info(
        { runId: run.id, count: existingNotifications.length },
        'Notifications already sent for this run, skipping'
      );
      return;
    }

    // Invia le notifiche
    await Promise.all([
      sendEmailNotification(run, fullScenario, user),
      sendSlackNotification(run, fullScenario),
    ]);

    logger.info({ runId: run.id }, 'Notifications sent successfully');
  } catch (error) {
    logger.error({ error, runId: run.id }, 'Failed to send notifications');
  }
}