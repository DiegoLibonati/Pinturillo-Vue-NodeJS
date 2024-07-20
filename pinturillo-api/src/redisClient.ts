import * as redis from "redis";
import { configs } from "@src/configs";

const REDIS_HOST = configs.REDIS.HOST;
const REDIS_PORT = configs.REDIS.PORT;

const redisClient = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

export const setRedis = <T>(key: string, value: T): void => {
  redisClient.set(key, JSON.stringify(value));
};

export const getRedis = async <T>(key: string): Promise<T> => {
  const value = await redisClient.get(key);
  const valueParsed = JSON.parse(value!) as T;
  return valueParsed;
};

export const delRedis = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("ready", () => {
  console.log("Redis client ready");
});

redisClient.on("error", (err: string) => {
  console.error("Redis client error:", err);
});

redisClient.on("reconnecting", () => {
  console.log("Redis client reconnecting");
});

redisClient.on("end", () => {
  console.log("Redis client disconnected");
});

redisClient.connect().catch((err: string) => {
  console.error("Redis client failed to connect:", err);
});

export default redisClient;
