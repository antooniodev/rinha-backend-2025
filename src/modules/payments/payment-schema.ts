import { PaymentProcessor } from "@prisma/client"
import z from "zod"

export type Payment = {
  correlationId: string
  amount: number
  processor: PaymentProcessor
}

export const savePaymentSchema = z.object({
  correlationId: z.string().min(1, "Correlation ID is required"),
  amount: z.number().refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
    message: "Amount must be a decimal number with up to 2 decimal places",
  }),
})

export type SavePaymentInput = z.infer<typeof savePaymentSchema>

export const getPaymentsSummarySchema = z.object({
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
})
