import EventEmitter from "events"
import { ProcessingPaymentBody } from "../processors/processors-schema"

class PaymentNode {
    data: ProcessingPaymentBody
    next: PaymentNode | null = null

    constructor(data: ProcessingPaymentBody) {
        this.data = data
    }
}
export class PaymentLinkedList extends EventEmitter {
    private head: PaymentNode | null = null
    private tail: PaymentNode | null = null
    private size: number = 0
    private readonly maxSize: number

    constructor(maxSize = 50000) {
        super()
        this.maxSize = maxSize
        this.setMaxListeners(0)
    }

    enqueue(data: ProcessingPaymentBody): boolean {
        if(this.size >= this.maxSize) {
            throw new Error("Queue is full")
        }
        const newNode = new PaymentNode(data)

       if(!this.tail) {
        this.head = this.tail = newNode
       } else {
        this.tail.next = newNode
        this.tail = newNode
       }
        this.size++
        this.emit("newPayment")
        return true
    }

    dequeue(): ProcessingPaymentBody | null {
        if(!this.head) return null

        const payment = this.head.data
        this.head = this.head.next

        if(!this.head) {
            this.tail = null
        }

        this.size--
        return payment
    }
}