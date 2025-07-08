"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRoutes = paymentsRoutes;
const payment_controller_1 = require("./payment-controller");
async function paymentsRoutes(app) {
    app.get("/payments-summary", payment_controller_1.PaymentsController.getSummary);
    app.post("/payments", payment_controller_1.PaymentsController.processPayments);
}
