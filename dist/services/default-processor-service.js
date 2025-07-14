"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPaymentProcessorService = void 0;
const axios_1 = require("../config/axios");
exports.DefaultPaymentProcessorService = {
    managerPaymentProcessor: async (payment) => {
        try {
            const response = await axios_1.defaultProcessor.post("/payments", payment);
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },
    healthCheck: async () => {
        try {
            const response = await axios_1.defaultProcessor.get("/payments/service-health");
            const check = response.data;
            return check;
        }
        catch (error) {
            throw error;
        }
    },
    purgePayments: async () => {
        try {
            const response = await axios_1.defaultProcessor.post("/admin/purge-payments");
            return response.data;
        }
        catch (error) {
            throw error;
        }
    },
};
