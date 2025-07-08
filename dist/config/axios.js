"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fallbackProcessor = exports.defaultProcessor = void 0;
const axios_1 = __importDefault(require("axios"));
exports.defaultProcessor = axios_1.default.create({
    baseURL: process.env.PAYMENT_PROCESSOR_URL_DEFAULT || "",
});
exports.fallbackProcessor = axios_1.default.create({
    baseURL: process.env.PAYMENT_PROCESSOR_URL_FALLBACK || "",
});
