"use strict";
// src/health-check-starter.ts
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const health_queue_1 = require("./health-queue");
console.log("Starting dedicated Health Check process...");
health_queue_1.HealthCheckQueue.healthCheckCycle();
