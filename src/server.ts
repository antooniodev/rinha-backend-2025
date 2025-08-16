import express from "express"
import paymentsRoutes from "./features/payments/payments.routes"
import { startWorkers } from "./features/processors/workers"
import { PaymentService } from "./features/payments/payment-service"

const app = express()
const PORT = 3333

app.use(express.json())
app.use(paymentsRoutes)
app.get("/health", (req, res) => {
  res.status(200).send({ status: "ok" })
})

async function start() {
  await PaymentService.resetDatabaseData()
  console.log("Iniciando fila e workers...")
  startWorkers(20)
  console.log("Workers iniciados. Startando servidor...")
  app.listen(PORT, () => {
    console.log(`(Server) running on port ${PORT}`)
  })
}

start()
