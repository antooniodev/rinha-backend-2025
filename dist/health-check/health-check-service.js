"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckService = void 0;
exports.getHealthOfProcessors = getHealthOfProcessors;
const redis_1 = require("../config/redis");
const default_processor_service_1 = require("../services/default-processor-service");
const fallback_processor_service_1 = require("../services/fallback-processor-service");
let healthCheckTask = null;
const LOCK_KEY = "healthcheck:leader-lock"; // Chave no Redis para a trava
const LOCK_TTL_SECONDS = 15; // A trava expira em 15s para evitar deadlock
let healthCheckInterval = null;
async function runHealthCheckCycle() {
    let processorToCheck = "default";
    // Lógica para alternar entre os processadores
    const toggleProcessor = () => {
        processorToCheck = processorToCheck === "default" ? "fallback" : "default";
    };
    const check = async () => {
        try {
            const service = processorToCheck === "default"
                ? default_processor_service_1.DefaultPaymentProcessorService
                : fallback_processor_service_1.FallbackPaymentProcessorService;
            const healthCheck = await service.healthCheck();
            const status = {
                failing: healthCheck.failing,
                minResponseTime: healthCheck.minResponseTime,
                lastChecked: new Date().toISOString(),
            };
            await redis_1.redisClient.set(`processor:status:${processorToCheck}`, JSON.stringify(status));
        }
        catch (error) {
            console.error(`Falha no ciclo do Health Check para ${processorToCheck}:`, error.message);
        }
        finally {
            // Alterna para o próximo processador, mesmo em caso de erro
            toggleProcessor();
        }
    };
    // Executa a primeira checagem imediatamente
    await check();
    // Agenda as próximas
    healthCheckInterval = setInterval(check, 5100);
}
async function acquireLockAndStart() {
    try {
        const redis = redis_1.redisClient; // Assumindo que seu redisClient já está conectado
        // O comando 'SET key value NX EX ttl' é uma forma atômica de adquirir uma trava.
        // 'NX' significa "só defina se a chave não existir".
        const lockAcquired = await redis.set(LOCK_KEY, "leader", "EX", LOCK_TTL_SECONDS, "NX");
        if (lockAcquired) {
            console.log("Trava adquirida. Esta instância é a líder do Health Check.");
            // Inicia o ciclo de health checks
            runHealthCheckCycle();
            // Renova a trava periodicamente para não perdê-la
            setInterval(async () => {
                await redis.expire(LOCK_KEY, LOCK_TTL_SECONDS);
            }, (LOCK_TTL_SECONDS / 2) * 1000); // Renova na metade do tempo de vida
        }
        else {
            console.log("Outra instância já é a líder do Health Check. Esta instância ficará inativa.");
        }
    }
    catch (error) {
        console.error("Erro ao tentar adquirir a trava do Health Check:", error);
    }
}
const healthCache = {
    data: null,
    lastUpdated: 0,
};
const CACHE_TTL_MS = 200;
async function getHealthOfProcessors() {
    const now = Date.now();
    if (healthCache.data && now - healthCache.lastUpdated < CACHE_TTL_MS) {
        return healthCache.data;
    }
    try {
        const status_default = await redis_1.redisClient.get("processor:status:default");
        const status_fallback = await redis_1.redisClient.get("processor:status:fallback");
        const healthData = {
            default: JSON.parse(status_default || "{}"),
            fallback: JSON.parse(status_fallback || "{}"),
        };
        healthCache.data = healthData;
        healthCache.lastUpdated = now;
        return healthData;
    }
    catch (error) {
        console.error("Error fetching health check status:", error);
        return healthCache.data || { default: {}, fallback: {} };
    }
}
exports.HealthCheckService = {
    start: acquireLockAndStart,
    getHealthOfProcessors,
};
