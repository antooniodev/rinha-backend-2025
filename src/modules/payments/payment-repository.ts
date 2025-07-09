import { prisma } from "../../config/prisma"
import { Payment, PaymentLog } from "./payment-schema"
export const PaymentRepository = {
  savePayment: async (payment: PaymentLog) => {
    return prisma.payment.create({
      data: {
        correlationId: payment.correlationId,
        amount: payment.amount,
        processor: payment.processor,
        requestedAt: payment.requestedAt,
      },
    })
  },
  getSummary: async (from?: string, to?: string) => {
    const where: any = {}
    if (from || to) {
      where.requestedAt = {}
      if (from) where.requestedAt.gte = new Date(from)
      if (to) where.requestedAt.lte = new Date(to)
    }

    const result = await prisma.payment.groupBy({
      by: ["processor"],
      _sum: {
        amount: true,
      },
      _count: {
        correlationId: true,
      },
      where,
    })

    // Initialize the response with default structure
    const formatted: Record<
      string,
      { totalRequests: number; totalAmount: number }
    > = {
      default: {
        totalRequests: 0,
        totalAmount: 0,
      },
      fallback: {
        totalRequests: 0,
        totalAmount: 0,
      },
    }

    // Populate with actual data if exists
    for (const row of result) {
      formatted[row.processor] = {
        totalRequests: row._count.correlationId,
        totalAmount: Number(row._sum.amount ?? 0),
      }
    }

    return formatted
  },
}
