"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerPaymentsProcessors = void 0;
const default_processor_service_1 = require("./default-processor-service");
const fallback_processor_service_1 = require("./fallback-processor-service");
exports.ManagerPaymentsProcessors = {
    handleHealthCheck: async () => {
        try {
            const healthCheckDefault = await default_processor_service_1.DefaultPaymentProcessorService.healthCheck();
            const healthCheckFallback = await fallback_processor_service_1.FallbackPaymentProcessorService.healthCheck();
            if (healthCheckDefault.falling) {
                return {
                    processor: "fallback",
                    minResponseTime: healthCheckFallback.minResponseTime,
                };
            }
            else {
                if (healthCheckFallback.minResponseTime <
                    healthCheckDefault.minResponseTime) {
                    return {
                        processor: "fallback",
                        minResponseTime: healthCheckFallback.minResponseTime,
                    };
                }
                else {
                    return {
                        processor: "default",
                        minResponseTime: healthCheckDefault.minResponseTime,
                    };
                }
            }
        }
        catch (error) {
            throw new Error("(ManagerPaymentsProcessors) Error during health check: " + error);
        }
    },
    index: async (payment) => {
        const paymentToSent = {
            correlationId: payment.correlationId,
            amount: payment.amount,
            requestedAt: new Date().toISOString(),
        };
        try {
            await new Promise((resolve) => setTimeout(resolve, 6000));
            const healthCheck = await exports.ManagerPaymentsProcessors.handleHealthCheck();
            if (healthCheck.processor === "default") {
                await default_processor_service_1.DefaultPaymentProcessorService.managerPaymentProcessor(paymentToSent);
            }
            else {
                await fallback_processor_service_1.FallbackPaymentProcessorService.managerPaymentProcessor(paymentToSent);
            }
            return {
                processor: healthCheck.processor,
                correlationId: paymentToSent.correlationId,
                amount: paymentToSent.amount,
                requestedAt: paymentToSent.requestedAt,
            };
        }
        catch (error) {
            throw new Error("(ManagerPaymentsProcessors) Error during payment processing: " + error);
        }
    },
};
