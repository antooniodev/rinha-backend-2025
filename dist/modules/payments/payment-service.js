"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const manager_payments_processors_1 = require("../payment-processors/manager-payments-processors");
const payment_repository_1 = require("./payment-repository");
exports.PaymentService = {
    getPaymentsSummary: async (from, to) => {
        const summary = await payment_repository_1.PaymentRepository.getSummary(from, to);
        return summary;
    },
    processPayment: async (input) => {
        const processingPayment = await manager_payments_processors_1.ManagerPaymentsProcessors.index(input);
        const payment = {
            correlationId: processingPayment.correlationId,
            amount: processingPayment.amount,
            processor: processingPayment.processor,
            requestedAt: processingPayment.requestedAt,
        };
        return payment_repository_1.PaymentRepository.savePayment(payment);
    },
};
