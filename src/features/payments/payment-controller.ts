import { Request, Response } from "express"
import { PaymentService } from "./payment-service"

export const PaymentsController = {
  getSummary: async (req: Request, res: Response) => {
    try {
      const { from, to } = req.query

      const summary = await PaymentService.getPaymentsSummary(
        from ? String(from) : undefined,
        to ? String(to) : undefined
      )

      return res.status(200).json(summary)
    } catch (error) {
      console.error("Erro em /payments-summary:", error)
      return res.status(500).json({ error: "internal server error" })
    }
  },

  processPayments: (req: Request, res: Response) => {
    try {
      const input = req.body

      if (!input?.correlationId || !input?.amount) {
        return res.status(400).json({ error: "invalid payload" })
      }

      PaymentService.enqueuePayment(input)
      return res.status(202).json({}) // Accepted, sem esperar processamento
    } catch (error) {
      console.error("Erro em /payments:", error)
      return res.status(500).json({ error: "internal server error" })
    }
  },

  purgePayments: async (_req: Request, res: Response) => {
    try {
      await PaymentService.resetDatabaseData()
      return res.status(200).json({
        message: "Payments data purged successfully",
      })
    } catch (error) {
      console.error("Erro em /purge-payments:", error)
      return res.status(500).json({ error: "internal server error" })
    }
  },
}
