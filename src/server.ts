import express from "express"
import paymentsRoutes from "./features/payments/payments.routes"
import { startWorkers } from "./features/processors/workers"
import { HealthCheckService } from "./features/health-check/health-check-service"


const app = express()
const PORT = 9999

app.use(express.json())
app.use(paymentsRoutes)
async function start() {
  console.log("Iniciando fila e workers...")
  startWorkers(20) 
  console.log("Workers iniciados. Startando servidor...")
  app.listen(PORT, () => {
    console.log(`(Server) running on port ${PORT}`)
  })
}

start()