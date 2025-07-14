import { FastifyReply, FastifyRequest } from "fastify"
import { PaymentService } from "./payment-service"

interface CreatePaymentInput {
  correlationId: string
  amount: number
}

interface GetPaymentsSummaryParams {
  from?: string
  to?: string
}
export const PaymentsController = {
  getSummary: async (
    request: FastifyRequest<{ Querystring: GetPaymentsSummaryParams }>,
    reply: FastifyReply
  ) => {
    try {
      const { from, to } = request.query

      console.log("Fetching payment summary from:", from, "to:", to)

      const summary = await PaymentService.getPaymentsSummary(from, to)
      reply.code(200).send(summary)
    } catch (error) {
      throw error
    }
  },

  processPayments: async (
    request: FastifyRequest<{ Body: CreatePaymentInput }>,
    reply: FastifyReply
  ) => {
    const start = process.hrtime.bigint()
    try {
      const input = request.body
      if (!input) {
        reply.code(400).send({ error: "Invalid body" })
        return
      }

      PaymentService.processPayment(input)

      reply.code(200).send({
        message: "Payment processed successfully",
      })
    } catch (error) {
      throw error
    } finally {
      const end = process.hrtime.bigint()
      const elapsedMs = Number(end - start) / 1_000_000
      if (elapsedMs > 1000) {
        // só loga se demorar mais de 1s
        console.warn(
          `[SLOW REQUEST] processPayment demorou ${elapsedMs.toFixed(2)}ms`
        )
      }
    }
  },
  purgePayments: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await PaymentService.resetDatabaseData()

      reply.code(200).send({
        message: "Payments data purged successfully",
      })
    } catch (error) {
      throw error
    }
  },
}
