"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const redis_1 = require("./config/redis");
exports.PaymentRepository = {
    savePayment: async (payment) => {
        const sortedSetKey = "payments_by_date";
        const score = new Date(payment.requestedAt).getTime();
        const member = `${payment.amount}|${payment.processor}|${payment.correlationId}`;
        await redis_1.redisClient.zadd(sortedSetKey, score, member);
    },
    getSummary: async (from, to) => {
        const sortedSetKey = "payments_by_date";
        const minScore = from ? new Date(from).getTime() : "-inf";
        const maxScore = to ? new Date(to).getTime() : "+inf";
        const payments = await redis_1.redisClient.zrangebyscore(sortedSetKey, minScore, maxScore);
        const summary = {
            default: { totalRequests: 0, totalAmount: 0 },
            fallback: { totalRequests: 0, totalAmount: 0 },
        };
        for (const payment of payments) {
            const [amountStr, processor] = payment.split("|");
            const amount = parseFloat(amountStr);
            if (summary[processor]) {
                summary[processor].totalRequests += 1;
                summary[processor].totalAmount += amount;
            }
        }
        summary.default.totalAmount = parseFloat(summary.default.totalAmount.toFixed(2));
        summary.fallback.totalAmount = parseFloat(summary.fallback.totalAmount.toFixed(2));
        return summary;
    },
    resetDatabaseData: async () => {
        await redis_1.redisClient.flushdb();
    },
};
