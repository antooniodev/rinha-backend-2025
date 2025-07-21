import { summaryConnection } from "../../core/lib/redis"
import QueueService from "../../core/lib/redis-queue"
import { PaymentLog } from "../payments/payment-schema"
import { PaymentService } from "../payments/payment-service"
import { DefaultPaymentProcessorService } from "./default-processor-service"
import { FallbackPaymentProcessorService } from "./fallback-processor-service"
import { ProcessingPaymentBody } from "./processors-schema"

export async function processPayment(payment: ProcessingPaymentBody): Promise<void> {
  const queue = new QueueService()
  try {
    
    await DefaultPaymentProcessorService.managerPaymentProcessor(payment)
    const logData: PaymentLog = {
      correlationId: payment.correlationId,
      amount: payment.amount,
      processor: "default",
      requestedAt: payment.requestedAt,
    }
    try {
      await PaymentService.savePaymentLog(logData)
      return
    } catch (logError) {
      console.error(
        "CRITICAL [Default]: Payment OK, but log save failed. Re-queueing.",
        logError
      )
    }
  } catch (defaultError: any) {
    console.warn(
      `Default processor failed. Attempting fallback... Error: ${defaultError.message}`
    )
  }

  try {
    await FallbackPaymentProcessorService.managerPaymentProcessor(payment)

    const logData: PaymentLog = {
      correlationId: payment.correlationId,
      amount: payment.amount,
      processor: "fallback",
      requestedAt: payment.requestedAt,
    }

    try {
      await PaymentService.savePaymentLog(logData)
      return 
    } catch (logError) {
      console.error(
        "CRITICAL [Fallback]: Payment OK, but log save failed. Re-queueing.",
        logError
      )
    }
  } catch (fallbackError: any) {
    console.error(
      `CRITICAL: Fallback processor also failed. Re-queueing job. Error: ${fallbackError.message}`
    )
    queue.addJob(payment)
  }
}
