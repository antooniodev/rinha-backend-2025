import { buildApp } from "./app"
import { prisma } from "./config/prisma"
import {
  consumeQueue,
  ManagerPaymentsProcessors,
} from "./modules/payment-processors/manager-payments-processors"

const server = buildApp()

const start = async (): Promise<void> => {
  try {
    await consumeQueue()
    await server.listen({ port: 9999, host: "0.0.0.0" })
    console.log(`Server is running on http://localhost:9999`)
    prisma.$connect()
  } catch (error) {
    server.log.error(error)
    prisma.$disconnect()
    process.exit(1)
  }
}

start()
