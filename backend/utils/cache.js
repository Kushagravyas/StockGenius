import redis from "redis";

const client = redis.createClient({ url: process.env.REDIS_URL });
await client.connect();

export const getCache = async (key) => {
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
};

export const setCache = async (key, data, ttl = 3600) => {
  await client.setEx(key, ttl, JSON.stringify(data));
};
