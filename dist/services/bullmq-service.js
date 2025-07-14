"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullMqService = void 0;
const bullmq_1 = require("bullmq");
const default_processor_service_1 = require("./default-processor-service");
const fallback_processor_service_1 = require("./fallback-processor-service");
const payment_service_1 = require("./payment-service");
const redis_1 = require("../config/redis");
const QUEUE_NAME = "payment-queue";
const queue = new bullmq_1.Queue(QUEUE_NAME, {
    connection: redis_1.redisClient,
});
function addJobToQueue(jobData) {
    queue
        .add("processPayment", jobData, {
        removeOnComplete: true,
        removeOnFail: true,
    })
        .catch((error) => {
        console.error("Failed to add job to queue:", error);
    });
}
async function processPaymentJob(payment) {
    try {
        let processor = await redis_1.redisClient.get("processor_choice");
        if (!processor)
            processor = "default";
        if (processor === "default") {
            await default_processor_service_1.DefaultPaymentProcessorService.managerPaymentProcessor(payment);
        }
        else if (processor === "fallback") {
            await fallback_processor_service_1.FallbackPaymentProcessorService.managerPaymentProcessor(payment);
        }
        else if (processor === "requeue") {
            console.log("Requeuing payment due to processor failure");
            addJobToQueue(payment);
            return;
        }
        const logData = {
            correlationId: payment.correlationId,
            amount: payment.amount,
            processor: processor,
            requestedAt: payment.requestedAt,
        };
        try {
            await payment_service_1.PaymentService.savePaymentLog(logData);
        }
        catch (logError) {
            console.error("CRITICAL: Payment succeeded but log save failed. Retrying job.", { logData, logError });
            throw new Error("LOG_SAVE_FAILED");
        }
    }
    catch (err) {
        // console.error("Erro ao processar pagamento com o provedor:", err)
        throw err;
    }
}
async function processWorker() {
    const worker = new bullmq_1.Worker(QUEUE_NAME, async (job) => {
        await processPaymentJob(job.data);
    }, {
        connection: redis_1.workerRedisClient,
        concurrency: 100,
    });
    console.log("Worker is running...");
    if (!worker.isRunning()) {
        worker.run();
    }
    worker.on("failed", (job, err) => {
        // if (job) {
        //   console.error(`Job failed: ${job.id}, Error: ${err.message}`)
        // } else {
        //   console.error(`Job failed: unknown job, Error: ${err.message}`)
        // }
    });
}
exports.BullMqService = {
    addJobToQueue,
    processWorker,
};
