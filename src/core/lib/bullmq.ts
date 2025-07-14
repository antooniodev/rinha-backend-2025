import { Queue, Worker } from "bullmq"
import opossum from "opossum"

import IORedis from "ioredis"
import { ProcessingPaymentBody } from "../../features/processors/processors-schema"
import { stringifyPaymentLog } from "../../config/fast-serializer"
import { DefaultPaymentProcessorService } from "../../features/processors/default-processor-service"
import { FallbackPaymentProcessorService } from "../../features/processors/fallback-processor-service"
import { redisClient, workerRedisClient } from "./redis"
import { PaymentLog } from "../../features/payments/payment-schema"
import { PaymentService } from "../../features/payments/payment-service"

const QUEUE_NAME = "payment-queue"

const queue = new Queue(QUEUE_NAME, {
  connection: redisClient,
})

function addJobToQueue(jobData: ProcessingPaymentBody) {
  queue
    .add("processPayment", jobData, {
      removeOnComplete: true,
      removeOnFail: true,
    })
    .catch((error) => {
      console.error("Failed to add job to queue:", error)
    })
}

async function processPaymentJob(payment: ProcessingPaymentBody) {
  try {
    let processor = await redisClient.get("processor_choice")

    if (!processor) processor = "default"
    console.log(`Using processor: ${processor}`)
    if (processor === "default") {
      await DefaultPaymentProcessorService.managerPaymentProcessor(payment)
    } else if (processor === "fallback") {
      await FallbackPaymentProcessorService.managerPaymentProcessor(payment)
    } else if (processor === "requeue") {
      console.log("Requeuing payment due to processor failure")
      addJobToQueue(payment)
      return
    }

    const logData: PaymentLog = {
      correlationId: payment.correlationId,
      amount: payment.amount,
      processor: processor,
      requestedAt: payment.requestedAt,
    }

    try {
      await PaymentService.savePaymentLog(logData)
    } catch (logError) {
      console.error(
        "CRITICAL: Payment succeeded but log save failed. Retrying job.",
        { logData, logError }
      )
      throw new Error("LOG_SAVE_FAILED")
    }
  } catch (err) {
    // console.error("Erro ao processar pagamento com o provedor:", err)
    throw err
  }
}

async function processWorker() {
  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      await processPaymentJob(job.data)
    },
    {
      connection: workerRedisClient,
      concurrency: 50,
    }
  )
  console.log("Worker is running...")

  if (!worker.isRunning()) {
    worker.run()
  }

  worker.on("failed", (job, err) => {
    // if (job) {
    //   console.error(`Job failed: ${job.id}, Error: ${err.message}`)
    // } else {
    //   console.error(`Job failed: unknown job, Error: ${err.message}`)
    // }
  })
}

export const BullMqService = {
  addJobToQueue,
  processWorker,
}
