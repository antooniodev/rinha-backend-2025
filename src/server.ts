import express from "express"
import paymentsRoutes from "./features/payments/payments.routes"
import { PaymentLinkedList } from "./features/payments/payment-linked-list"
import { startWorkers } from "./features/processors/workers"


const app = express()
const PORT = 9999

app.use(express.json())
app.use(paymentsRoutes)
export const globalQueue = new PaymentLinkedList()
async function start() {
  console.log("Iniciando fila e workers...")
  startWorkers(20, globalQueue) 
  console.log("Workers iniciados. Startando servidor...")
  app.listen(PORT, () => {
    console.log(`(Server) running on port ${PORT}`)
  })
}

start()