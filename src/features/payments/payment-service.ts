import { globalQueue } from "../../server"
import { ProcessingPaymentBody } from "../processors/processors-schema"
import { PaymentLinkedList } from "./payment-linked-list"
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
    globalQueue.enqueue(paymentToSent)
  },
  enqueueExistingPayment: (input: ProcessingPaymentBody) => {
    globalQueue.enqueue(input)
  },
  dequeuePayment: () => {
    return globalQueue.dequeue()
  },
  savePaymentLog: async (input: PaymentLog): Promise<void> => {
    await PaymentRepository.savePayment(input)
  },
  resetDatabaseData: async (): Promise<void> => {
    console.log("Resetting database data")
    await PaymentRepository.resetDatabaseData()
  },
}
