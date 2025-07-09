import fastify from "fastify"
import "reflect-metadata"
import { paymentsRoutes } from "./modules/payments/payments.routes"
import { HandleError } from "./utils/errors/handleError"

export function buildApp() {
  const app = fastify({ logger: false })
  app.register(paymentsRoutes)
  app.setErrorHandler(HandleError)

  return app
}
