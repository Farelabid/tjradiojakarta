import { createClient, RedisClientType } from "redis";

/**
 * Singleton Redis client (re-use antar invocation)
 * Pakai Node runtime (bukan Edge) untuk node-redis.
 */
let client: RedisClientType | null = null;

export async function getRedis(): Promise<RedisClientType> {
  if (client && client.isOpen) return client;

  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is not set");

  client = createClient({ url });
  client.on("error", (err) => console.error("[Redis] error:", err));
  await client.connect();

  return client;
}
