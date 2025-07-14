import { PaymentLog, PaymentInput } from "../types/payment-schema"
import { PaymentRepository } from "../payment-repository"
import { ProcessingPaymentBody } from "../types/processors-schema"
import { BullMqService } from "./bullmq-service"
export const PaymentService = {
  getPaymentsSummary: async (from?: string, to?: string) => {
    const summary = await PaymentRepository.getSummary(from, to)

    return summary
  },
  processPayment: (input: PaymentInput) => {
    const paymentToSent: ProcessingPaymentBody = {
      correlationId: input.correlationId,
      amount: input.amount,
      requestedAt: new Date().toISOString(),
    }
    BullMqService.addJobToQueue(paymentToSent)
  },
  savePaymentLog: async (input: PaymentLog): Promise<void> => {
    await PaymentRepository.savePayment(input)
  },
  resetDatabaseData: async (): Promise<void> => {
    console.log("Resetting database data")
    await PaymentRepository.resetDatabaseData()
  },
}
