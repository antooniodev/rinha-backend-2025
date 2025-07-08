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
      where.createdAt = {}
      if (from) where.createdAt.gte = from
      if (to) where.createdAt.lte = to
    }
    const result = await prisma.payment.groupBy({
      by: ["processor"],
      _sum: {
        amount: true,
      },
      _count: {
        correlationId: true,
      },
      where: Object.keys(where).length ? where : undefined,
    })

    // Format the result as requested
    const formatted: Record<
      string,
      { totalRequests: number; totalAmount: number }
    > = {}
    for (const row of result) {
      formatted[row.processor] = {
        totalRequests: row._count.correlationId,
        totalAmount: Number(row._sum.amount ?? 0),
      }
    }
    return formatted
  },
}
