import type { VerifyConnectionOptions } from "@/types/helpers";

import redisClient from "@/configs/redis.config";
import { logger } from "@/configs/logger.config";

const DEFAULT_RETRIES = 5;
const DEFAULT_BASE_DELAY_MS = 500;
const DEFAULT_MAX_DELAY_MS = 8000;

export const verifyRedisConnection = async (
  options: VerifyConnectionOptions = {}
): Promise<boolean> => {
  const {
    retries = DEFAULT_RETRIES,
    baseDelayMs = DEFAULT_BASE_DELAY_MS,
    maxDelayMs = DEFAULT_MAX_DELAY_MS,
  } = options;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await redisClient.ping();
      logger.info({ attempt }, "Redis connection verified.");
      return true;
    } catch {
      if (attempt === retries) break;

      const retryInMs = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      logger.warn({ attempt, retries, retryInMs }, "Redis ping failed. Retrying...");
      await new Promise((resolve) => setTimeout(resolve, retryInMs));
    }
  }

  logger.warn(
    { retries },
    "Redis is unreachable after all retries. The server keeps running and the Redis client will reconnect automatically once the service is back. If you are running without Docker, make sure Redis is up and that REDIS_HOST/REDIS_PORT in your .env point to it (e.g. REDIS_HOST=localhost instead of the compose hostname)."
  );

  return false;
};
