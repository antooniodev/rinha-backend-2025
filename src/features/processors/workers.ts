import { PaymentLinkedList } from "../payments/payment-linked-list"
import { processPayment } from "./process-payments-service"

export function startWorkers(concurrency: number, queue: PaymentLinkedList) {
  console.log(`Iniciando workers com concorrência ${concurrency}...`)

  let activeWorkers = 0

  async function processQueue() {
    while (activeWorkers < concurrency) {
      const payment = queue.dequeue()
      if (!payment) break

      activeWorkers++
      console.log(`Processando pagamento... Workers ativos: ${activeWorkers}`)

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

  queue.on('newPayment', () => {
    processQueue()
  })

  processQueue()
}
