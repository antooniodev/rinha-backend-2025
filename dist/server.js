"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalQueue = void 0;
const express_1 = __importDefault(require("express"));
const payments_routes_1 = __importDefault(require("./features/payments/payments.routes"));
const payment_linked_list_1 = require("./features/payments/payment-linked-list");
const workers_1 = require("./features/processors/workers");
const app = (0, express_1.default)();
const PORT = 9999;
app.use(express_1.default.json());
app.use(payments_routes_1.default);
exports.globalQueue = new payment_linked_list_1.PaymentLinkedList();
async function start() {
    console.log("Iniciando fila e workers...");
    (0, workers_1.startWorkers)(20);
    console.log("Workers iniciados. Startando servidor...");
    app.listen(PORT, () => {
        console.log(`(Server) running on port ${PORT}`);
    });
}
start();
