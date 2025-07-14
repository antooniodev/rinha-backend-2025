"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fallbackCircuitBreaker = exports.defaultCircuitBreaker = void 0;
// src/config/circuit-breakers.ts
const opossum_1 = __importDefault(require("opossum"));
const default_processor_service_1 = require("../services/default-processor-service");
const fallback_processor_service_1 = require("../services/fallback-processor-service");
// Opções para configurar o comportamento do breaker
const options = {
    timeout: 1500, // Se a chamada demorar mais de 3s, considera falha
    errorThresholdPercentage: 40, // Se 50% das últimas chamadas falharem, abre o circuito
    resetTimeout: 8000,
};
// Função que o breaker do 'default' irá executar
const defaultAction = (payment) => default_processor_service_1.DefaultPaymentProcessorService.managerPaymentProcessor(payment);
// Função que o breaker do 'fallback' irá executar
const fallbackAction = (payment) => fallback_processor_service_1.FallbackPaymentProcessorService.managerPaymentProcessor(payment);
// Crie e exporte uma instância do breaker para cada processador
exports.defaultCircuitBreaker = new opossum_1.default(defaultAction, options);
exports.fallbackCircuitBreaker = new opossum_1.default(fallbackAction, options);
// Adiciona logs para sabermos o que está acontecendo (ótimo para depuração)
exports.defaultCircuitBreaker.on("open", () => console.log(`[${new Date().toISOString()}] CIRCUIT OPEN: Default Processor`));
exports.defaultCircuitBreaker.on("close", () => console.log(`[${new Date().toISOString()}] CIRCUIT CLOSED: Default Processor`));
exports.fallbackCircuitBreaker.on("open", () => console.log(`[${new Date().toISOString()}] CIRCUIT OPEN: Fallback Processor`));
exports.fallbackCircuitBreaker.on("close", () => console.log(`[${new Date().toISOString()}] CIRCUIT CLOSED: Fallback Processor`));
