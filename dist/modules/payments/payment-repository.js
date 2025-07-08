"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.PaymentRepository = {
    savePayment: async (payment) => {
        return prisma_1.prisma.payment.create({
            data: {
                correlationId: payment.correlationId,
                amount: payment.amount,
                processor: payment.processor,
                requestedAt: payment.requestedAt,
            },
        });
    },
    getSummary: async (from, to) => {
        const where = {};
        if (from || to) {
            where.createdAt = {};
            if (from)
                where.createdAt.gte = from;
            if (to)
                where.createdAt.lte = to;
        }
        const result = await prisma_1.prisma.payment.groupBy({
            by: ["processor"],
            _sum: {
                amount: true,
            },
            _count: {
                correlationId: true,
            },
            where: Object.keys(where).length ? where : undefined,
        });
        // Format the result as requested
        const formatted = {};
        for (const row of result) {
            formatted[row.processor] = {
                totalRequests: row._count.correlationId,
                totalAmount: Number(row._sum.amount ?? 0),
            };
        }
        return formatted;
    },
};
