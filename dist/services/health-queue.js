"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const default_processor_service_1 = require("./default-processor-service");
const fallback_processor_service_1 = require("./fallback-processor-service");
const healthQueue = new bullmq_1.Queue("health-queue", {
    connection: redis_1.redisClient,
});
async function selectProcessor() {
    const [defaultHealth, fallbackHealth] = await Promise.all([
        default_processor_service_1.DefaultPaymentProcessorService.healthCheck(),
        fallback_processor_service_1.FallbackPaymentProcessorService.healthCheck(),
    ]).catch((error) => {
        console.error("Error fetching processor health checks:", error);
        return [null, null];
    });
    if (!defaultHealth || !fallbackHealth) {
        return;
    }
    const chosenProcessorName = choosenProcessor(defaultHealth, fallbackHealth);
    redis_1.redisClient.set("processor_choice", chosenProcessorName);
}
function choosenProcessor(defaultHealth, fallbackHealth) {
    if (defaultHealth.failing && fallbackHealth.failing)
        return "requeue";
    if (defaultHealth.failing)
        return "fallback";
    const MAX_RESPONSE_TIME = 2000;
    const choosenByTime = defaultHealth.minResponseTime < MAX_RESPONSE_TIME
        ? "default"
        : fallbackHealth.minResponseTime < MAX_RESPONSE_TIME
            ? "fallback"
            : "requeue";
    return choosenByTime;
}
async function healthCheckCycle() {
    await redis_1.redisClient.set("processor_choice", "default");
    healthQueue.upsertJobScheduler("processHealthCheck", {
        every: 5100,
    });
    new bullmq_1.Worker("health-queue", async () => {
        selectProcessor();
    }, {
        connection: redis_1.workerRedisClient,
    });
}
exports.HealthCheckQueue = {
    healthCheckCycle,
};
