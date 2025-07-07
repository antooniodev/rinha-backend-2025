import fastify from "fastify"
import { HandleError } from "utils/errors/handleError"
import { paymentsRoutes } from "./modules/payments/payments.routes"

export function buildApp() {
  const app = fastify({ logger: true })
  app.register(paymentsRoutes)
  app.setErrorHandler(HandleError)
  return app
}
