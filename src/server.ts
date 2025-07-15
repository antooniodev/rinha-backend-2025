import "dotenv/config"
import { buildApp } from "./app"

import { BullMqService } from "./core/lib/bullmq"
import { PaymentService } from "./features/payments/payment-service"

const server = buildApp()
server.server.timeout = 1500 // 1.5s timeout
server.server.keepAliveTimeout = 1000 // 1s keep-alive
server.server.headersTimeout = 1100

const start = async (): Promise<void> => {
  try {
    BullMqService.processWorker()
    await PaymentService.resetDatabaseData()

    await server.listen({ port: 9999, host: "0.0.0.0", backlog: 1024 })
    console.log(`Server is running on http://localhost:9999`)
  } catch (error) {
    server.log.error(error)
    process.exit(1)
  }
}

start()
