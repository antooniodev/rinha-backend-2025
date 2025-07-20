import { PaymentsController } from "./payment-controller"
import { Router } from "express"

const paymentsRoutes = Router()
paymentsRoutes.get("/payments-summary", PaymentsController.getSummary)
paymentsRoutes.post("/payments", PaymentsController.processPayments)
paymentsRoutes.post("/purge-payments", PaymentsController.purgePayments)

export default paymentsRoutes