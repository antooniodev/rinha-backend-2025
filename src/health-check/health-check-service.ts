import { healthRedisClient, redisClient } from "../config/redis"
import { DefaultPaymentProcessorService } from "../services/default-processor-service"
import { FallbackPaymentProcessorService } from "../services/fallback-processor-service"
import { ScheduledTask } from "node-cron"
import { ProcessorHealthCheck } from "../types/processors-schema"

async function runHealthCheckCycle() {
  const check = async () => {
    const [defaultHealth, fallbackHealth] = await Promise.all([
      DefaultPaymentProcessorService.healthCheck(),
      FallbackPaymentProcessorService.healthCheck(),
    ]).catch((error) => {
      console.error("Error fetching processor health checks:", error)
      return [null, null]
    })

    if (!defaultHealth || !fallbackHealth) {
      return
    }

    const chosenProcessorName = choosenProcessor(defaultHealth, fallbackHealth)
    console.log(chosenProcessorName)

    healthRedisClient.set("processor_choice", chosenProcessorName)
  }

  await check()
  setInterval(check, 7000)
}
function choosenProcessor(
  defaultHealth: ProcessorHealthCheck,
  fallbackHealth: ProcessorHealthCheck
) {
  if (defaultHealth.failing && fallbackHealth.failing) return "requeue"

  if (defaultHealth.failing) return "fallback"
  const MAX_RESPONSE_TIME = 2000
  const choosenByTime =
    defaultHealth.minResponseTime < MAX_RESPONSE_TIME
      ? "default"
      : fallbackHealth.minResponseTime < MAX_RESPONSE_TIME
      ? "fallback"
      : "requeue"
  return choosenByTime
}
export const HealthCheckService = {
  start: runHealthCheckCycle,
}
