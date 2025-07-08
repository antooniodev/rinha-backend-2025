import { Payment } from "../payments/payment-schema"
import { DefaultPaymentProcessorService } from "./default-processor-service"
import { FallbackPaymentProcessorService } from "./fallback-processor-service"
import { SendPaymentToProcessorInput } from "./processors-schema"

export const ManagerPaymentsProcessors = {
  handleHealthCheck: async () => {
    try {
      const healthCheckDefault =
        await DefaultPaymentProcessorService.healthCheck()
      const healthCheckFallback =
        await FallbackPaymentProcessorService.healthCheck()

      if (healthCheckDefault.falling) {
        return {
          processor: "fallback",
          minResponseTime: healthCheckFallback.minResponseTime,
        }
      } else {
        if (
          healthCheckFallback.minResponseTime <
          healthCheckDefault.minResponseTime
        ) {
          return {
            processor: "fallback",
            minResponseTime: healthCheckFallback.minResponseTime,
          }
        } else {
          return {
            processor: "default",
            minResponseTime: healthCheckDefault.minResponseTime,
          }
        }
      }
    } catch (error) {
      throw new Error(
        "(ManagerPaymentsProcessors) Error during health check: " + error
      )
    }
  },
  index: async (payment: Payment) => {
    const paymentToSent: SendPaymentToProcessorInput = {
      correlationId: payment.correlationId,
      amount: payment.amount,
      requestedAt: new Date().toISOString(),
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 6000))
      const healthCheck = await ManagerPaymentsProcessors.handleHealthCheck()
      if (healthCheck.processor === "default") {
        console.log("Using Default Payment Processor, body:", paymentToSent)

        await DefaultPaymentProcessorService.managerPaymentProcessor(
          paymentToSent
        )
      } else {
        console.log("Using Fallback Payment Processor, body:", paymentToSent)
        await FallbackPaymentProcessorService.managerPaymentProcessor(
          paymentToSent
        )
      }
      return {
        processor: healthCheck.processor,
        correlationId: paymentToSent.correlationId,
        amount: paymentToSent.amount,
        requestedAt: paymentToSent.requestedAt,
      }
    } catch (error) {
      throw new Error(
        "(ManagerPaymentsProcessors) Error during payment processing: " + error
      )
    }
  },
}
