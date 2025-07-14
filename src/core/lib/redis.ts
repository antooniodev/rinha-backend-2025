import IORedis from "ioredis"

const redisUrl = process.env.REDIS_URL as string

const retryStrategy = (times: number) => {
  const delay = Math.min(times * 500, 5000)
  return delay
}

export const redisClient = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  retryStrategy,
})

export const workerRedisClient = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  retryStrategy,
})

export const healthRedisClient = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  retryStrategy,
})

console.log("Conexões IORedis para BullMQ e App inicializadas.")
