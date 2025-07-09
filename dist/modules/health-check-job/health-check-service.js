"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckService = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const manager_payments_processors_1 = require("../payment-processors/manager-payments-processors");
let healthCheckTask = null;
function createHealthCheckCron() {
    return node_cron_1.default.schedule("*/6 * * * * *", async () => {
        try {
            const processor = await manager_payments_processors_1.ManagerPaymentsProcessors.handleHealthCheck();
            console.log("Health check successful:", processor);
        }
        catch (error) {
            console.error("Health check failed:", error);
        }
    }, {});
}
function startHealthCheckCron() {
    if (!healthCheckTask) {
        healthCheckTask = createHealthCheckCron();
    }
    healthCheckTask.start();
}
function stopHealthCheckCron() {
    if (healthCheckTask) {
        healthCheckTask.stop();
    }
}
exports.HealthCheckService = {
    start: startHealthCheckCron,
    stop: stopHealthCheckCron,
};
