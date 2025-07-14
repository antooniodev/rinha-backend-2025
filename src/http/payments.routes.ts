import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { PaymentsController } from "../payment-controller"

export async function paymentsRoutes(app: FastifyInstance) {
  app.get("/payments-summary", PaymentsController.getSummary)
  app.post("/payments", PaymentsController.processPayments)
  app.post("/purge-payments", PaymentsController.purgePayments)
}
