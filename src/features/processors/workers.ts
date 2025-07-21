import QueueService from "../../core/lib/redis-queue"
import { processPayment } from "./process-payments-service"

export function startWorkers(concurrency: number,) {
  console.log(`Iniciando workers com concorrência ${concurrency}...`)

  let activeWorkers = 0
  const queue = new QueueService()

  async function processQueue() {
    while (activeWorkers < concurrency) {
      const payment = await queue.getJob()
      if (!payment) break

      activeWorkers++

      processPayment(payment)
        .catch(err => {
          console.error("Erro ao processar pagamento", err)
        })
        .finally(() => {
          activeWorkers--
          processQueue()
        })
    }
  }
  processQueue()
}
