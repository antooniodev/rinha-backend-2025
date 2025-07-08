import { defaultProcessor } from "config/axios"
import {
  ProcessorHealthCheck,
  SendPaymentToProcessorInput,
} from "./processors-schema"

export const DefaultPaymentProcessorService = {
  managerPaymentProcessor: async (payment: SendPaymentToProcessorInput) => {
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
}
