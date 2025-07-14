import fastJson from "fast-json-stringify"

const paymentSchema = {
  type: "object" as const,
  properties: {
    correlationId: { type: "string" },
    amount: { type: "number" },
    requestedAt: { type: "string" },
  },
  required: ["correlationId", "amount", "requestedAt"],
}

export const stringifyPayment = fastJson(paymentSchema)

const paymentLogSchema = {
  type: "object" as const,
  properties: {
    correlationId: { type: "string" },
    amount: { type: "number" },
    requestedAt: { type: "string" },
    processor: { type: "string" },
  },
  required: ["correlationId", "amount", "requestedAt", "processor"],
}

export const stringifyPaymentLog = fastJson(paymentLogSchema)
