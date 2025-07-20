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
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
  },
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
    await DefaultPaymentProcessorService.managerPaymentProcessor(payment)

    await PaymentService.savePaymentLog({
      correlationId: payment.correlationId,
      amount: payment.amount,
      processor: "default",
      requestedAt: payment.requestedAt,
    })
  } catch (defaultError) {
    console.error("Default processor failed, trying fallback:", defaultError)

    try {
      await FallbackPaymentProcessorService.managerPaymentProcessor(payment)

      await PaymentService.savePaymentLog({
        correlationId: payment.correlationId,
        amount: payment.amount,
        processor: "fallback",
        requestedAt: payment.requestedAt,
      })
    } catch (fallbackError) {
      console.error(
        "Error processing payment with fallback processor:",
        fallbackError
      )

      addJobToQueue(payment)
    }
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
      concurrency: 150,
      maxStalledCount: 1,
      stalledInterval: 10000,
    }
  )
  console.log("Worker is running...")

  if (!worker.isRunning()) {
    worker.run()
  }

  worker.on("failed", (job, err) => {
    if (job) {
      console.error(`Job failed: ${job.id}, Error: ${err.message}`)
    } else {
      console.error(`Job failed: unknown job, Error: ${err.message}`)
    }
  })
}

export const BullMqService = {
  addJobToQueue,
  processWorker,
}
