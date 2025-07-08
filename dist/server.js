"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const prisma_1 = require("./config/prisma");
const server = (0, app_1.buildApp)();
const start = async () => {
    try {
        await server.listen({ port: 9999 });
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
