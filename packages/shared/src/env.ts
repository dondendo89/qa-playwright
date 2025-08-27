import { z } from 'zod';

// Schema di validazione per le variabili d'ambiente
export const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url(),

  // Stripe
  STRIPE_PUBLIC_KEY: z.string().startsWith('pk_'),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),

  // Email
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_FROM: z.string().email(),

  // Slack (optional)
  SLACK_WEBHOOK_URL: z.string().url().optional(),

  // S3 Storage
  S3_ENDPOINT: z.string().url(),
  S3_REGION: z.string(),
  S3_BUCKET: z.string(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),

  // Session
  SESSION_SECRET: z.string().min(32),

  // App
  APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // Worker
  WORKER_CONCURRENCY: z.string().transform(Number).default('2'),
  PLAYWRIGHT_TIMEOUT_MS: z.string().transform(Number).default('60000'),
  MAX_LINKS_TO_CHECK: z.string().transform(Number).default('50'),
});

// Tipo inferito dallo schema
export type Env = z.infer<typeof envSchema>;

// Funzione per validare le variabili d'ambiente
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment variables');
  }
}