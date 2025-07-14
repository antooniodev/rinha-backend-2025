"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const bullmq_1 = require("./core/lib/bullmq");
const payment_service_1 = require("./features/payments/payment-service");
const server = (0, app_1.buildApp)();
const start = async () => {
    try {
        bullmq_1.BullMqService.processWorker();
        await payment_service_1.PaymentService.resetDatabaseData();
        await server.listen({ port: 9999, host: "0.0.0.0" });
        console.log(`Server is running on http://localhost:9999`);
    }
    catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};
start();
