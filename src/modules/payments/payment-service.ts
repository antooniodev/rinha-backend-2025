import { PaymentProcessor } from "@prisma/client"
import { ManagerPaymentsProcessors } from "../payment-processors/manager-payments-processors"
import { PaymentRepository } from "./payment-repository"
import { Payment, PaymentLog, SavePaymentInput } from "./payment-schema"

export const PaymentService = {
  getPaymentsSummary: async (from?: string, to?: string) => {
    const summary = await PaymentRepository.getSummary(from, to)
    return summary
  },
  processPayment: async (input: SavePaymentInput) => {
    const processingPayment = await ManagerPaymentsProcessors.index(input)
    const payment: PaymentLog = {
      correlationId: processingPayment.correlationId,
      amount: processingPayment.amount,
      processor: processingPayment.processor as PaymentProcessor,
      requestedAt: processingPayment.requestedAt,
    }
    return PaymentRepository.savePayment(payment)
  },
}
