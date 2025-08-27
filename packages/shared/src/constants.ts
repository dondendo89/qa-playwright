import { PlanLimits, SubscriptionPlan } from './types';

// Limiti dei piani
export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  [SubscriptionPlan.STARTER]: {
    maxProjects: 1,
    maxScenariosPerProject: 2,
    minScheduleInterval: 60, // 1 ora
    maxRunDuration: 60, // 1 minuto
    maxLinksToCheck: 20,
    retentionDays: 30,
  },
  [SubscriptionPlan.PRO]: {
    maxProjects: 5,
    maxScenariosPerProject: 10,
    minScheduleInterval: 15, // 15 minuti
    maxRunDuration: 90, // 1.5 minuti
    maxLinksToCheck: 50,
    retentionDays: 60,
  },
  [SubscriptionPlan.BUSINESS]: {
    maxProjects: 20,
    maxScenariosPerProject: 50,
    minScheduleInterval: 5, // 5 minuti
    maxRunDuration: 120, // 2 minuti
    maxLinksToCheck: 100,
    retentionDays: 90,
  },
};

// Prezzi dei piani (in centesimi)
export const PLAN_PRICES = {
  [SubscriptionPlan.STARTER]: 1900, // $19/mese
  [SubscriptionPlan.PRO]: 4900, // $49/mese
  [SubscriptionPlan.BUSINESS]: 9900, // $99/mese
};

// Configurazioni di default per gli scenari
export const DEFAULT_SCENARIO_CONFIG = {
  timeout: 60000, // 60 secondi
  maxLinksToCheck: 50,
  viewport: {
    width: 1280,
    height: 720,
  },
  userAgent: 'QA Playwright Monitor/1.0',
};

// Configurazioni per le notifiche
export const DEFAULT_EMAIL_TEMPLATE = 'alert';
export const DEFAULT_EMAIL_SUBJECT = 'Scenario Failed: {scenarioName}';

// Configurazioni per il worker
export const DEFAULT_WORKER_CONCURRENCY = 2;
export const SCHEDULER_POLL_INTERVAL = 30000; // 30 secondi

// Configurazioni per la retention
export const DEFAULT_RETENTION_DAYS = 90;

// Configurazioni per il rate limiting
export const RATE_LIMIT_MAX = 100; // richieste
export const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto