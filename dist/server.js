"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payments_routes_1 = __importDefault(require("./features/payments/payments.routes"));
const redis_queue_1 = require("./features/processors/redis-queue");
const app = (0, express_1.default)();
const PORT = 9999;
app.use(express_1.default.json());
app.use(payments_routes_1.default);
async function start() {
    console.log("Iniciando workers Redis...");
    redis_queue_1.RedisQueueService.startWorkers(15);
    console.log("Workers iniciados, startando servidor...");
}
start();
app.listen(PORT, () => {
    console.log(`(Server) running on port ${PORT}`);
});
