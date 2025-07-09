"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerPaymentsProcessors = void 0;
exports.consumeQueue = consumeQueue;
const axios_1 = __importDefault(require("axios"));
const default_processor_service_1 = require("./default-processor-service");
const fallback_processor_service_1 = require("./fallback-processor-service");
const amqplib_1 = __importDefault(require("amqplib"));
exports.ManagerPaymentsProcessors = {
    handleHealthCheck: async () => {
        let healthCheckDefault;
        let healthCheckFallback;
        try {
            healthCheckDefault = await default_processor_service_1.DefaultPaymentProcessorService.healthCheck();
        }
        catch (e) {
            console.log("Default processor indisponível:", e);
        }
        try {
            healthCheckFallback = await fallback_processor_service_1.FallbackPaymentProcessorService.healthCheck();
        }
        catch (e) {
            console.log("Fallback processor indisponível:", e);
        }
        if (!healthCheckDefault && !healthCheckFallback) {
            throw new Error("Nenhum processador de pagamento está disponível");
        }
        // Se só o fallback estiver disponível
        if (!healthCheckDefault) {
            return {
                processor: "fallback",
                minResponseTime: healthCheckFallback?.minResponseTime ?? null,
            };
        }
        // Se só o default estiver disponível
        if (!healthCheckFallback) {
            return {
                processor: "default",
                minResponseTime: healthCheckDefault.minResponseTime,
            };
        }
        return {
            processor: "default",
            minResponseTime: healthCheckDefault.minResponseTime,
        };
    },
    index: async (payment) => {
        const paymentToSent = {
            correlationId: payment.correlationId,
            amount: payment.amount,
            requestedAt: new Date().toISOString(),
        };
        try {
            // await new Promise((resolve) => setTimeout(resolve, 6000))
            // const healthCheck = await ManagerPaymentsProcessors.handleHealthCheck()
            // console.log(
            //   "Health Check Result:",
            //   healthCheck.processor,
            //   healthCheck.minResponseTime
            // )
            // console.log("Payment to be sent:", paymentToSent)
            // if (healthCheck.processor === "default") {
            //   await DefaultPaymentProcessorService.managerPaymentProcessor(
            //     paymentToSent
            //   )
            // } else {
            //   await FallbackPaymentProcessorService.managerPaymentProcessor(
            //     paymentToSent
            //   )
            // }
            console.log("(Payment to processing)", paymentToSent);
            // await DefaultPaymentProcessorService.managerPaymentProcessor(
            //   paymentToSent
            // )
            return {
                processor: "default",
                correlationId: paymentToSent.correlationId,
                amount: paymentToSent.amount,
                requestedAt: paymentToSent.requestedAt,
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error("Axios error:", {
                    status: error.response?.status,
                    data: error.response?.data,
                    headers: error.response?.headers,
                });
            }
            throw new Error("(ManagerPaymentsProcessors) Error during payment processing: " + error);
        }
    },
};
async function consumeQueue() {
    try {
        console.log("Iniciando o consumo da fila de pagamentos...");
        const rabbitmqUrl = process.env.RABBITMQ_URL || "";
        const connection = await amqplib_1.default.connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue("payment-processor-queue", {
            durable: true,
        });
        channel.consume("payment-processor-queue", async (msg) => {
            if (msg !== null) {
                console.log(` [x] Recebido ${msg.content.toString()}`);
                channel.ack(msg);
                try {
                    const paymentData = JSON.parse(msg.content.toString());
                    const processingPayment = await default_processor_service_1.DefaultPaymentProcessorService.managerPaymentProcessor(paymentData);
                    console.log("(consumeQueue) Payment processed successfully:", processingPayment);
                }
                catch (error) {
                    console.error("(consumeQueue) Error processing payment:", error instanceof Error ? error.message : error);
                }
            }
        });
    }
    catch (error) {
        console.log("(consumeQueue) Error connecting to RabbitMQ:", error instanceof Error ? error.message : error);
    }
}
