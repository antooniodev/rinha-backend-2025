import IORedis from "ioredis"

const redisUrl = process.env.REDIS_URL as string
const retryStrategy = (times: number) => {
  const delay = Math.min(times * 500, 5000)
  return delay
}

const baseConfig = {
  // commandTimeout: 5000, // 5 segundos - mais realista
  // connectTimeout: 10000, // 10 segundos para conectar
  lazyConnect: true, // Conecta quando necessário
  enableAutoPipelining: true, // Otimização de performance
  maxRetriesPerRequest: null, // Limite de tentativas por comando
  retryStrategy,
  // Configurações de pool de conexões
  // maxLoadingTimeout: 10000,
}
export const redisClient = new IORedis(redisUrl, {
  ...baseConfig,
})

// Cliente dedicado para workers do BullMQ
export const workerRedisClient = new IORedis(redisUrl, {
  ...baseConfig,
  // Configurações otimizadas para workers
  // commandTimeout: 10000, // Timeout maior para workers
})

// Cliente para health checks
export const healthRedisClient = new IORedis(redisUrl, {
  ...baseConfig,
  // commandTimeout: 10000, // Timeout menor para health checks
})

console.log("Conexões IORedis para BullMQ e App inicializadas.")
