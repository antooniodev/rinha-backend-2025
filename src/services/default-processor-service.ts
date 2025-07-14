import { defaultProcessor } from "../config/axios"
import {
  ProcessingPaymentBody,
  ProcessorHealthCheck,
} from "../types/processors-schema"

export const DefaultPaymentProcessorService = {
  managerPaymentProcessor: async (payment: ProcessingPaymentBody) => {
    try {
      const response = await defaultProcessor.post("/payments", payment)
      return response.data
    } catch (error) {
      throw error
    }
  },
  healthCheck: async () => {
    try {
      const response = await defaultProcessor.get("/payments/service-health")
      const check: ProcessorHealthCheck = response.data
      return check
    } catch (error) {
      throw error
    }
  },
  purgePayments: async () => {
    try {
      const response = await defaultProcessor.post("/admin/purge-payments")
      return response.data
    } catch (error) {
      throw error
    }
  },
}
