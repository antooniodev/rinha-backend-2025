"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyPaymentLog = exports.stringifyPayment = void 0;
const fast_json_stringify_1 = __importDefault(require("fast-json-stringify"));
const paymentSchema = {
    type: "object",
    properties: {
        correlationId: { type: "string" },
        amount: { type: "number" },
        requestedAt: { type: "string" },
    },
    required: ["correlationId", "amount", "requestedAt"],
};
exports.stringifyPayment = (0, fast_json_stringify_1.default)(paymentSchema);
const paymentLogSchema = {
    type: "object",
    properties: {
        correlationId: { type: "string" },
        amount: { type: "number" },
        requestedAt: { type: "string" },
        processor: { type: "string" },
    },
    required: ["correlationId", "amount", "requestedAt", "processor"],
};
exports.stringifyPaymentLog = (0, fast_json_stringify_1.default)(paymentLogSchema);
