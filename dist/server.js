"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const prisma_1 = require("./config/prisma");
const manager_payments_processors_1 = require("./modules/payment-processors/manager-payments-processors");
const server = (0, app_1.buildApp)();
const start = async () => {
    try {
        await (0, manager_payments_processors_1.consumeQueue)();
        await server.listen({ port: 9999, host: "0.0.0.0" });
        console.log(`Server is running on http://localhost:9999`);
        prisma_1.prisma.$connect();
    }
    catch (error) {
        server.log.error(error);
        prisma_1.prisma.$disconnect();
        process.exit(1);
    }
};
start();
