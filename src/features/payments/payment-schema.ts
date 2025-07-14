export type Payment = {
  correlationId: string
  amount: number
}

export type PaymentLog = Payment & {
  processor: string
  requestedAt: string
}

export interface PaymentInput {
  correlationId: string
  amount: number
}
