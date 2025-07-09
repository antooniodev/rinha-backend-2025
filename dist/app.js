"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
require("reflect-metadata");
const payments_routes_1 = require("./modules/payments/payments.routes");
const handleError_1 = require("./utils/errors/handleError");
function buildApp() {
    const app = (0, fastify_1.default)({ logger: false });
    app.register(payments_routes_1.paymentsRoutes);
    app.setErrorHandler(handleError_1.HandleError);
    return app;
}
