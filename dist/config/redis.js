"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerRedisClient = exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redisUrl = process.env.REDIS_URL;
const retryStrategy = (times) => {
    const delay = Math.min(times * 500, 5000);
    return delay;
};
exports.redisClient = new ioredis_1.default(redisUrl, {
    maxRetriesPerRequest: null,
    retryStrategy,
});
exports.workerRedisClient = new ioredis_1.default(redisUrl, {
    maxRetriesPerRequest: null,
    retryStrategy,
});
console.log("Conexões IORedis para BullMQ e App inicializadas.");
