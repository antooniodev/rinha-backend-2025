import axios from "axios"
import { Payment } from "../payments/payment-schema"
import { DefaultPaymentProcessorService } from "./default-processor-service"
import { FallbackPaymentProcessorService } from "./fallback-processor-service"
import { SendPaymentToProcessorInput } from "./processors-schema"
import amqp from "amqplib"

export const ManagerPaymentsProcessors = {
  handleHealthCheck: async () => {
    let healthCheckDefault
    let healthCheckFallback

    try {
      healthCheckDefault = await DefaultPaymentProcessorService.healthCheck()
    } catch (e) {
      console.log("Default processor indisponível:", e)
    }

    try {
      healthCheckFallback = await FallbackPaymentProcessorService.healthCheck()
    } catch (e) {
      console.log("Fallback processor indisponível:", e)
    }

    if (!healthCheckDefault && !healthCheckFallback) {
      throw new Error("Nenhum processador de pagamento está disponível")
    }

    // Se só o fallback estiver disponível
    if (!healthCheckDefault) {
      return {
        processor: "fallback",
        minResponseTime: healthCheckFallback?.minResponseTime ?? null,
      }
    }

    // Se só o default estiver disponível
    if (!healthCheckFallback) {
      return {
        processor: "default",
        minResponseTime: healthCheckDefault.minResponseTime,
      }
    }
    return {
      processor: "default",
      minResponseTime: healthCheckDefault.minResponseTime,
    }
  },
  index: async (payment: Payment) => {
    const paymentToSent: SendPaymentToProcessorInput = {
      correlationId: payment.correlationId,
      amount: payment.amount,
      requestedAt: new Date().toISOString(),
    }

    try {
      // await new Promise((resolve) => setTimeout(resolve, 6000))
      // const healthCheck = await ManagerPaymentsProcessors.handleHealthCheck()
      // console.log(
      //   "Health Check Result:",
      //   healthCheck.processor,
      //   healthCheck.minResponseTime
      // )
      // console.log("Payment to be sent:", paymentToSent)
      // if (healthCheck.processor === "default") {
      //   await DefaultPaymentProcessorService.managerPaymentProcessor(
      //     paymentToSent
      //   )
      // } else {
      //   await FallbackPaymentProcessorService.managerPaymentProcessor(
      //     paymentToSent
      //   )
      // }
      console.log("(Payment to processing)", paymentToSent)

      // await DefaultPaymentProcessorService.managerPaymentProcessor(
      //   paymentToSent
      // )
      return {
        processor: "default",
        correlationId: paymentToSent.correlationId,
        amount: paymentToSent.amount,
        requestedAt: paymentToSent.requestedAt,
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        })
      }
      throw new Error(
        "(ManagerPaymentsProcessors) Error during payment processing: " + error
      )
    }
  },
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function connectToRabbitMQ(
  retryCount = 0,
  maxRetries = 5
): Promise<void> {
  const rabbitmqUrl = process.env.RABBITMQ_URL || ""

  try {
    console.log(
      `Tentando conectar ao RabbitMQ (tentativa ${retryCount + 1}/${
        maxRetries + 1
      })...`
    )

    const connection = await amqp.connect(rabbitmqUrl)
    console.log("Conexão com RabbitMQ estabelecida.")

    const channel = await connection.createChannel()
    console.log("Canal criado com sucesso.")

    await channel.assertQueue("payment-processor-queue", {
      durable: true,
    })

    // Handle connection close events
    connection.on("close", () => {
      console.log("Conexão com RabbitMQ foi fechada. Tentando reconectar...")
      setTimeout(() => connectToRabbitMQ(0, maxRetries), 5000)
    })

    connection.on("error", (err) => {
      console.error("Erro na conexão com RabbitMQ:", err.message)
    })

    channel.consume("payment-processor-queue", async (msg) => {
      if (msg !== null) {
        console.log(` [x] Recebido ${msg.content.toString()}`)
        channel.ack(msg)
        try {
          const paymentData: SendPaymentToProcessorInput = JSON.parse(
            msg.content.toString()
          )

          const processingPayment =
            await DefaultPaymentProcessorService.managerPaymentProcessor(
              paymentData
            )
          console.log(
            "(consumeQueue) Payment processed successfully:",
            processingPayment
          )
        } catch (error) {
          console.error(
            "(consumeQueue) Error processing payment:",
            error instanceof Error ? error.message : error
          )
        }
      }
    })
  } catch (error) {
    console.error(
      `(connectToRabbitMQ) Erro na tentativa ${retryCount + 1}:`,
      error instanceof Error ? error.message : error
    )

    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000 // Backoff exponencial: 1s, 2s, 4s, 8s, 16s
      console.log(`Aguardando ${delay}ms antes da próxima tentativa...`)
      await sleep(delay)
      return connectToRabbitMQ(retryCount + 1, maxRetries)
    } else {
      console.error("Máximo de tentativas de conexão atingido. Encerrando...")
      throw new Error("Falha ao conectar ao RabbitMQ após múltiplas tentativas")
    }
  }
}

export async function consumeQueue() {
  const maxRetries = 10
  let retryCount = 0

  async function attemptConsume(): Promise<void> {
    console.log(
      `Iniciando o consumo da fila de pagamentos... (tentativa ${
        retryCount + 1
      }/${maxRetries + 1})`
    )

    try {
      await connectToRabbitMQ()
      retryCount = 0 // Reset retry count on successful connection
    } catch (error) {
      console.error(
        "(consumeQueue) Erro fatal ao conectar ao RabbitMQ:",
        error instanceof Error ? error.message : error
      )

      if (retryCount < maxRetries) {
        retryCount++
        const delay = Math.min(Math.pow(2, retryCount) * 1000, 30000) // Máximo de 30 segundos
        console.log(
          `Tentando reconectar em ${delay}ms... (tentativa ${retryCount}/${
            maxRetries + 1
          })`
        )

        await sleep(delay)
        return attemptConsume()
      } else {
        console.error(
          "Máximo de tentativas de reconexão atingido. Encerrando processo..."
        )
        process.exit(1)
      }
    }
  }

  return attemptConsume()
}
