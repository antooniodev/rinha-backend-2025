import { FastifyReply, FastifyRequest } from "fastify"
import { getPaymentsSummarySchema, savePaymentSchema } from "./payment-schema"
import { PaymentService } from "./payment-service"

export const PaymentsController = {
  getSummary: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { from, to } = await getPaymentsSummarySchema.parseAsync(
        request.query
      )
      const summary = await PaymentService.getPaymentsSummary(from, to)
      reply.code(200).send(summary)
    } catch (error) {
      throw error
    }
  },

  processPayments: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const input = await savePaymentSchema.parseAsync(request.body)
      await PaymentService.processPayment(input)
      reply.code(200).send({
        message: "Payment processed successfully",
      })
    } catch (error) {
      throw error
    }
  },
}
