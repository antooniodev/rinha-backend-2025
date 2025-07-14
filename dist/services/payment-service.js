"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const payment_repository_1 = require("../payment-repository");
const bullmq_service_1 = require("./bullmq-service");
exports.PaymentService = {
    getPaymentsSummary: async (from, to) => {
        const summary = await payment_repository_1.PaymentRepository.getSummary(from, to);
        return summary;
    },
    processPayment: (input) => {
        const paymentToSent = {
            correlationId: input.correlationId,
            amount: input.amount,
            requestedAt: new Date().toISOString(),
        };
        bullmq_service_1.BullMqService.addJobToQueue(paymentToSent);
    },
    savePaymentLog: async (input) => {
        await payment_repository_1.PaymentRepository.savePayment(input);
    },
    resetDatabaseData: async () => {
        console.log("Resetting database data");
        await payment_repository_1.PaymentRepository.resetDatabaseData();
    },
};
