import IORedis from "ioredis"

const redisUrl = process.env.REDIS_URL as string
const retryStrategy = (times: number) => {
  const delay = Math.min(times * 500, 5000)
  return delay
}

const baseConfig = {
  lazyConnect: true, 
  enableAutoPipelining: true, 
  maxRetriesPerRequest: null, 
  retryStrategy,

}
export const redisClient = new IORedis(redisUrl, {
  ...baseConfig,
})


export const workerRedisClient = new IORedis(redisUrl, {
  ...baseConfig,
})

export const healthRedisClient = new IORedis(redisUrl, {
  ...baseConfig,
})

