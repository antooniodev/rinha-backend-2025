"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
require("reflect-metadata");
const payments_routes_1 = require("./http/payments.routes");
const handleError_1 = require("./http/handleError");
function buildApp() {
    const app = (0, fastify_1.default)({
        logger: {
            level: "error",
        },
    });
    app.removeContentTypeParser("application/json");
    app.addContentTypeParser("application/json", { parseAs: "string" }, (req, body, done) => {
        if (!body) {
            done(null, {}); // ou null
        }
        else {
            try {
                const jsonString = typeof body === "string" ? body : body.toString();
                done(null, JSON.parse(jsonString));
            }
            catch (err) {
                done(err instanceof Error ? err : new Error(String(err)));
            }
        }
    });
    app.register(payments_routes_1.paymentsRoutes);
    app.setErrorHandler(handleError_1.HandleError);
    return app;
}
