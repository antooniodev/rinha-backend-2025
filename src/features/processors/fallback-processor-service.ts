import { fallbackProcessor } from "../../core/lib/axios"
import {
  ProcessingPaymentBody,
  ProcessorHealthCheck,
} from "./processors-schema"

export const FallbackPaymentProcessorService = {
  managerPaymentProcessor: async (payment: ProcessingPaymentBody) => {
    try {
      const response = await fallbackProcessor.post("/payments", payment)
      return response.data
    } catch (error) {
      throw error
    }
  },
  healthCheck: async () => {
    try {
      const response = await fallbackProcessor.get("/payments/service-health")
      const check: ProcessorHealthCheck = response.data
      return check
    } catch (error) {
      throw error
    }
  },
  purgePayments: async () => {
    try {
      const response = await fallbackProcessor.post("/admin/purge-payments")
      return response.data
    } catch (error) {
      throw error
    }
  },
}
