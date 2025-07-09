import { PaymentProcessor } from "@prisma/client"
import { ManagerPaymentsProcessors } from "../payment-processors/manager-payments-processors"
import { PaymentRepository } from "./payment-repository"
import { Payment, PaymentLog, SavePaymentInput } from "./payment-schema"
import { HealthCheckService } from "../health-check-job/health-check-service"
import { SendPaymentToProcessorInput } from "../payment-processors/processors-schema"
import amqp from "amqplib"
export const PaymentService = {
  getPaymentsSummary: async (from?: string, to?: string) => {
    const summary = await PaymentRepository.getSummary(from, to)

    return summary
  },
  processPayment: async (input: SavePaymentInput) => {
    // const processingPayment = await ManagerPaymentsProcessors.index(input)
    const paymentToSent: SendPaymentToProcessorInput = {
      correlationId: input.correlationId,
      amount: input.amount,
      requestedAt: new Date().toISOString(),
    }
    // const payment: PaymentLog = {
    //   correlationId: processingPayment.correlationId,
    //   amount: processingPayment.amount,
    //   processor: processingPayment.processor as PaymentProcessor,
    //   requestedAt: processingPayment.requestedAt,
    // }
    // return PaymentRepository.savePayment(payment)

    const rabbitmqUrl = process.env.RABBITMQ_URL || ""
    const connection = await amqp.connect(rabbitmqUrl)
    const channel = await connection.createChannel()

    await channel.assertQueue("payment-processor-queue", {
      durable: true,
    })

    channel.sendToQueue(
      "payment-processor-queue",
      Buffer.from(JSON.stringify(paymentToSent))
    )

    await channel.close()
    await connection.close()
  },
}
