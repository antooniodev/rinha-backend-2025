import QueueService from "../../core/lib/redis-queue"
import { ProcessingPaymentBody } from "../processors/processors-schema"
import { PaymentRepository } from "./payment-repository"
import { PaymentInput, PaymentLog } from "./payment-schema"

export const PaymentService = {
  getPaymentsSummary: async (from?: string, to?: string) => {
    const summary = await PaymentRepository.getSummary(from, to)
    return summary
  },
  enqueuePayment: (input: PaymentInput) => {
    const paymentToSent: ProcessingPaymentBody = {
      correlationId: input.correlationId,
      amount: input.amount,
      requestedAt: new Date().toISOString(),
    }

    const queueService = new QueueService()
    queueService.addJob(paymentToSent)
  },
  savePaymentLog: async (input: PaymentLog): Promise<void> => {
    await PaymentRepository.savePayment(input)
  },
  resetDatabaseData: async (): Promise<void> => {
    await PaymentRepository.resetDatabaseData()
  },
}
