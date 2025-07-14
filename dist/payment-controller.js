"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const payment_service_1 = require("./services/payment-service");
exports.PaymentsController = {
    getSummary: async (request, reply) => {
        try {
            const { from, to } = request.query;
            console.log("Fetching payment summary from:", from, "to:", to);
            const summary = await payment_service_1.PaymentService.getPaymentsSummary(from, to);
            reply.code(200).send(summary);
        }
        catch (error) {
            throw error;
        }
    },
    processPayments: async (request, reply) => {
        const start = process.hrtime.bigint();
        try {
            const input = request.body;
            if (!input) {
                reply.code(400).send({ error: "Invalid body" });
                return;
            }
            payment_service_1.PaymentService.processPayment(input);
            reply.code(200).send({
                message: "Payment processed successfully",
            });
        }
        catch (error) {
            throw error;
        }
        finally {
            const end = process.hrtime.bigint();
            const elapsedMs = Number(end - start) / 1000000;
            if (elapsedMs > 1000) {
                // só loga se demorar mais de 1s
                console.warn(`[SLOW REQUEST] processPayment demorou ${elapsedMs.toFixed(2)}ms`);
            }
        }
    },
    purgePayments: async (request, reply) => {
        try {
            await payment_service_1.PaymentService.resetDatabaseData();
            reply.code(200).send({
                message: "Payments data purged successfully",
            });
        }
        catch (error) {
            throw error;
        }
    },
};
