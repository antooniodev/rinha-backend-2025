import z from "zod"

export type ProcessorHealthCheck = {
  falling: boolean
  minResponseTime: number
}

export const sendPaymentToProcessor = z.object({
  correlationId: z.string(),
  amount: z.number().positive(),
  requestedAt: z.string().datetime(),
})

export type SendPaymentToProcessorInput = z.infer<typeof sendPaymentToProcessor>
