import "dotenv/config"
import { buildApp } from "./app"
import { HealthCheckService } from "./health-check/health-check-service"
import { PaymentService } from "./services/payment-service"
import { BullMqService } from "./services/bullmq-service"

const server = buildApp()

const start = async (): Promise<void> => {
  try {
    BullMqService.processWorker()
    await PaymentService.resetDatabaseData()

    await server.listen({ port: 9999, host: "0.0.0.0" })
    console.log(`Server is running on http://localhost:9999`)
  } catch (error) {
    server.log.error(error)
    process.exit(1)
  }
}

start()
