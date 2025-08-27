import Redis from 'ioredis';
import { validateEnv } from '@qa-playwright/shared';
import { logger } from './logger';

let redisClient: Redis | null = null;

/**
 * Crea una connessione Redis
 */
export function createRedisConnection(): Redis {
  if (redisClient) {
    return redisClient;
  }

  const env = validateEnv();
  
  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy: (times) => {
      const delay = Math.min(times * 100, 3000);
      logger.info({ times, delay }, 'Redis connection retry');
      return delay;
    },
  });

  redisClient.on('connect', () => {
    logger.info('Redis connected');
  });

  redisClient.on('error', (err) => {
    logger.error({ error: err.message }, 'Redis connection error');
  });

  return redisClient;
}