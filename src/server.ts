import { buildApp } from "app"
import { prisma } from "./config/prisma"

const server = buildApp()

const start = async (): Promise<void> => {
  try {
    await server.listen({ port: 9999 })
    console.log(`Server is running on http://localhost:9999`)
    prisma.$connect()
  } catch (error) {
    server.log.error(error)
    prisma.$disconnect()
    process.exit(1)
  }
}

start()
