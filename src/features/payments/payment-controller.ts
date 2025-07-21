import { Request, Response } from "express"
import { PaymentService } from "./payment-service"

export const PaymentsController = {
  getSummary: async (
    request: Request,
    response: Response
  ) => {
    try {
      const { from, to } = request.query
      if (!from || !to) {
        return response.status(400)
      }

      const summary = await PaymentService.getPaymentsSummary(
        from as string,
        to as string
      )
      response.status(200).json(summary)
    } catch (error) {
      throw error
    }
  },

  processPayments: (request: Request, response: Response) => {
    try {
      const input = request.body
      PaymentService.enqueuePayment(input)
      return response.status(200).json({})
    } catch (error) {
      throw error
    }
  },
  purgePayments: async (request: Request, response: Response) => {
    try {
      await PaymentService.resetDatabaseData()

      response.status(200).json({
        message: "Payments data purged successfully",
      })
    } catch (error) {
      throw error
    }
  },
}
