export type ProcessorHealthCheck = {
  failing: boolean
  minResponseTime: number
}

export interface ProcessingPaymentBody {
  correlationId: string
  amount: number
  requestedAt: string
}
