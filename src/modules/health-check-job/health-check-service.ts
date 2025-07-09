import cron, { ScheduledTask } from "node-cron"
import { ManagerPaymentsProcessors } from "../payment-processors/manager-payments-processors"
let healthCheckTask: ScheduledTask | null = null

function createHealthCheckCron() {
  return cron.schedule(
    "*/6 * * * * *",
    async () => {
      try {
        const processor = await ManagerPaymentsProcessors.handleHealthCheck()
        console.log("Health check successful:", processor)
      } catch (error) {
        console.error("Health check failed:", error)
      }
    },
    {}
  )
}

function startHealthCheckCron() {
  if (!healthCheckTask) {
    healthCheckTask = createHealthCheckCron()
  }
  healthCheckTask.start()
}

function stopHealthCheckCron() {
  if (healthCheckTask) {
    healthCheckTask.stop()
  }
}

export const HealthCheckService = {
  start: startHealthCheckCron,
  stop: stopHealthCheckCron,
}
