import { PaymentRepository } from "./payment-repository"
import { Payment, SavePaymentInput } from "./payment-schema"

export const PaymentService = {
  getPaymentsSummary: async (from?: string, to?: string) => {
    const summary = await PaymentRepository.getSummary(from, to)
    return summary
  },
  processPayment: async (input: SavePaymentInput) => {
    const payment: Payment = {
      correlationId: input.correlationId,
      amount: input.amount,
      processor: "fallback",
    }
    return PaymentRepository.savePayment(payment)
  },
}
