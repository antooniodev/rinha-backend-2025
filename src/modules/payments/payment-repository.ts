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

    console.log("WHERE", where)
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
    const test = await prisma.payment.findMany({ where })
    console.log("TEST", test)

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
