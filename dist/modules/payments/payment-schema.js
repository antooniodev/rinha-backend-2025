"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentsSummarySchema = exports.savePaymentSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.savePaymentSchema = zod_1.default.object({
    correlationId: zod_1.default.string().min(1, "Correlation ID is required"),
    amount: zod_1.default.number().refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: "Amount must be a decimal number with up to 2 decimal places",
    }),
});
exports.getPaymentsSummarySchema = zod_1.default.object({
    from: zod_1.default.string().datetime({ offset: true }).optional(),
    to: zod_1.default.string().datetime({ offset: true }).optional(),
});
