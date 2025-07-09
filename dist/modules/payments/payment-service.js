"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const payment_repository_1 = require("./payment-repository");
const amqplib_1 = __importDefault(require("amqplib"));
exports.PaymentService = {
    getPaymentsSummary: async (from, to) => {
        const summary = await payment_repository_1.PaymentRepository.getSummary(from, to);
        return summary;
    },
    processPayment: async (input) => {
        // const processingPayment = await ManagerPaymentsProcessors.index(input)
        const paymentToSent = {
            correlationId: input.correlationId,
            amount: input.amount,
            requestedAt: new Date().toISOString(),
        };
        // const payment: PaymentLog = {
        //   correlationId: processingPayment.correlationId,
        //   amount: processingPayment.amount,
        //   processor: processingPayment.processor as PaymentProcessor,
        //   requestedAt: processingPayment.requestedAt,
        // }
        // return PaymentRepository.savePayment(payment)
        const rabbitmqUrl = process.env.RABBITMQ_URL || "";
        const connection = await amqplib_1.default.connect(rabbitmqUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue("payment-processor-queue", {
            durable: true,
        });
        channel.sendToQueue("payment-processor-queue", Buffer.from(JSON.stringify(paymentToSent)));
        await channel.close();
        await connection.close();
        // return HealthCheckService.start()
    },
};
