import type { VerifyConnectionOptions } from "@/types/helpers";

import redisClient from "@/configs/redis.config";
import { logger } from "@/configs/logger.config";

import { verifyRedisConnection } from "@/helpers/verify_redis_connection.helper";

jest.mock("@/configs/redis.config", () => ({
  __esModule: true,
  default: { ping: jest.fn() },
}));

jest.mock("@/configs/logger.config", () => ({
  logger: { info: jest.fn(), warn: jest.fn() },
}));

const mockPing = redisClient.ping as jest.Mock;
const mockLoggerInfo = logger.info as unknown as jest.Mock;
const mockLoggerWarn = logger.warn as unknown as jest.Mock;

describe("verify_redis_connection.helper", () => {
  describe("verifyRedisConnection", () => {
    it("should return true and log info when the ping succeeds on the first attempt", async () => {
      mockPing.mockResolvedValue("PONG");

      const result: boolean = await verifyRedisConnection({ baseDelayMs: 1 });

      expect(result).toBe(true);
      expect(mockPing).toHaveBeenCalledTimes(1);
      expect(mockLoggerInfo).toHaveBeenCalledWith({ attempt: 1 }, "Redis connection verified.");
      expect(mockLoggerWarn).not.toHaveBeenCalled();
    });

    it("should retry and return true when the ping succeeds on a later attempt", async () => {
      mockPing.mockRejectedValueOnce(new Error("down")).mockResolvedValueOnce("PONG");

      const result: boolean = await verifyRedisConnection({ baseDelayMs: 1 });

      expect(result).toBe(true);
      expect(mockPing).toHaveBeenCalledTimes(2);
      expect(mockLoggerInfo).toHaveBeenCalledWith({ attempt: 2 }, "Redis connection verified.");
    });

    it("should warn with attempt, retries and retryInMs between failed attempts", async () => {
      mockPing.mockRejectedValueOnce(new Error("down")).mockResolvedValueOnce("PONG");

      await verifyRedisConnection({ retries: 5, baseDelayMs: 1 });

      expect(mockLoggerWarn).toHaveBeenCalledTimes(1);
      expect(mockLoggerWarn).toHaveBeenCalledWith(
        { attempt: 1, retries: 5, retryInMs: 1 },
        "Redis ping failed. Retrying..."
      );
    });

    it("should double the delay on every failed attempt", async () => {
      mockPing.mockRejectedValue(new Error("down"));
      const options: VerifyConnectionOptions = { retries: 4, baseDelayMs: 1, maxDelayMs: 8000 };

      const result: boolean = await verifyRedisConnection(options);

      expect(result).toBe(false);
      expect(mockLoggerWarn).toHaveBeenNthCalledWith(
        1,
        { attempt: 1, retries: 4, retryInMs: 1 },
        "Redis ping failed. Retrying..."
      );
      expect(mockLoggerWarn).toHaveBeenNthCalledWith(
        2,
        { attempt: 2, retries: 4, retryInMs: 2 },
        "Redis ping failed. Retrying..."
      );
      expect(mockLoggerWarn).toHaveBeenNthCalledWith(
        3,
        { attempt: 3, retries: 4, retryInMs: 4 },
        "Redis ping failed. Retrying..."
      );
    });

    it("should cap the delay at maxDelayMs", async () => {
      mockPing.mockRejectedValue(new Error("down"));

      await verifyRedisConnection({ retries: 3, baseDelayMs: 2, maxDelayMs: 3 });

      expect(mockLoggerWarn).toHaveBeenNthCalledWith(
        1,
        { attempt: 1, retries: 3, retryInMs: 2 },
        "Redis ping failed. Retrying..."
      );
      expect(mockLoggerWarn).toHaveBeenNthCalledWith(
        2,
        { attempt: 2, retries: 3, retryInMs: 3 },
        "Redis ping failed. Retrying..."
      );
    });

    it("should return false and warn when all retries are exhausted", async () => {
      mockPing.mockRejectedValue(new Error("down"));

      const result: boolean = await verifyRedisConnection({ retries: 2, baseDelayMs: 1 });

      expect(result).toBe(false);
      expect(mockPing).toHaveBeenCalledTimes(2);
      expect(mockLoggerWarn).toHaveBeenLastCalledWith(
        { retries: 2 },
        expect.stringContaining("Redis is unreachable after all retries")
      );
    });

    it("should not log info when the ping never succeeds", async () => {
      mockPing.mockRejectedValue(new Error("down"));

      const result: boolean = await verifyRedisConnection({ retries: 2, baseDelayMs: 1 });

      expect(result).toBe(false);
      expect(mockLoggerInfo).not.toHaveBeenCalled();
    });
  });
});
