// src/health-check-starter.ts

import "dotenv/config"
import { HealthCheckService } from "./health-check-service"

async function start() {
  try {
    console.log("Starting dedicated Health Check process...")
    await HealthCheckService.start()
  } catch (error) {
    console.error("Error starting Health Check process:", error)
    process.exit(1)
  }
}

start()
