"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaymentToProcessor = void 0;
const zod_1 = __importDefault(require("zod"));
exports.sendPaymentToProcessor = zod_1.default.object({
    correlationId: zod_1.default.string(),
    amount: zod_1.default.number().positive(),
    requestedAt: zod_1.default.string().datetime(),
});
