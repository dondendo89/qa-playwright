// Tipi per il modello dati
export type User = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Subscription = {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Project = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Target = {
  id: string;
  projectId: string;
  name: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Scenario = {
  id: string;
  projectId: string;
  targetId: string;
  name: string;
  description: string | null;
  code: string;
  schedule: string; // Espressione cron
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Run = {
  id: string;
  scenarioId: string;
  status: RunStatus;
  startedAt: Date;
  completedAt: Date | null;
  duration: number | null; // in ms
  error: string | null;
  logs: string | null;
  counters: RunCounters | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Artifact = {
  id: string;
  runId: string;
  type: ArtifactType;
  path: string;
  size: number; // in bytes
  createdAt: Date;
};

export type Notification = {
  id: string;
  runId: string;
  type: NotificationType;
  status: NotificationStatus;
  sentAt: Date | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Enums
export enum SubscriptionPlan {
  STARTER = 'starter',
  PRO = 'pro',
  BUSINESS = 'business',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
}

export enum RunStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  TIMEOUT = 'timeout',
  CANCELED = 'canceled',
}

export enum ArtifactType {
  SCREENSHOT = 'screenshot',
  HAR = 'har',
  LOG = 'log',
}

export enum NotificationType {
  EMAIL = 'email',
  SLACK = 'slack',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

// Tipi aggiuntivi
export type RunCounters = {
  pageErrors: number;
  consoleErrors: number;
  brokenLinks: number;
  assertions: number;
  assertionsPassed: number;
};

// Tipi per i limiti dei piani
export type PlanLimits = {
  maxProjects: number;
  maxScenariosPerProject: number;
  minScheduleInterval: number; // in minuti
  maxRunDuration: number; // in secondi
  maxLinksToCheck: number;
  retentionDays: number;
};

// Tipi per le configurazioni degli scenari
export type ScenarioConfig = {
  timeout: number; // in ms
  maxLinksToCheck: number;
  viewport: {
    width: number;
    height: number;
  };
  userAgent?: string;
  extraHeaders?: Record<string, string>;
};

// Tipi per le notifiche
export type EmailNotificationConfig = {
  to: string[];
  subject?: string;
  template?: string;
};

export type SlackNotificationConfig = {
  webhookUrl: string;
  channel?: string;
  username?: string;
};