import "dotenv/config"
import { buildApp } from "./app"

import { BullMqService } from "./core/lib/bullmq"
import { PaymentService } from "./features/payments/payment-service"

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
