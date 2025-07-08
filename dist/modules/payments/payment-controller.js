"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const payment_schema_1 = require("./payment-schema");
const payment_service_1 = require("./payment-service");
exports.PaymentsController = {
    getSummary: async (request, reply) => {
        try {
            const { from, to } = await payment_schema_1.getPaymentsSummarySchema.parseAsync(request.query);
            const summary = await payment_service_1.PaymentService.getPaymentsSummary(from, to);
            reply.code(200).send(summary);
        }
        catch (error) {
            throw error;
        }
    },
    processPayments: async (request, reply) => {
        try {
            const input = await payment_schema_1.savePaymentSchema.parseAsync(request.body);
            await payment_service_1.PaymentService.processPayment(input);
            reply.code(200).send({
                message: "Payment processed successfully",
            });
        }
        catch (error) {
            throw error;
        }
    },
};
