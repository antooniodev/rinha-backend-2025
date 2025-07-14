"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FallbackPaymentProcessorService = void 0;
const axios_1 = require("../config/axios");
exports.FallbackPaymentProcessorService = {
    managerPaymentProcessor: async (payment) => {
        try {
            const response = await axios_1.fallbackProcessor.post("/payments", payment);
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },
    healthCheck: async () => {
        try {
            const response = await axios_1.fallbackProcessor.get("/payments/service-health");
            const check = response.data;
            return check;
        }
        catch (error) {
            throw error;
        }
    },
    purgePayments: async () => {
        try {
            const response = await axios_1.fallbackProcessor.post("/admin/purge-payments");
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },
};
