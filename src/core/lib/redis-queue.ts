import IORedis from "ioredis"
import { redisClient, workerRedisClient } from "./redis";
import { ProcessingPaymentBody } from "../../features/processors/processors-schema";
import { stringifyPayment } from "../../config/fast-serializer";
class QueueService {
  private connection: IORedis | null = null;
  private workerConnection: IORedis | null = null;
  private queueName = "payment_queue";
  constructor() {
    this.connection = redisClient;
    this.workerConnection = workerRedisClient;
  }

  async addJob(data: ProcessingPaymentBody): Promise<void> {
    if (!this.connection) {
      throw new Error("Redis connection not established");
    }
    try {
      await this.connection.rpush(this.queueName, stringifyPayment(data));
      console.log("Job added to Redis queue:", data);
    } catch (err) {
      console.error("Failed to add job to Redis queue:", err);
      throw err;
    }
  }

  async getJob(): Promise<ProcessingPaymentBody | null> {
    if (!this.workerConnection) {
      throw new Error("Redis connection not established");
    }
    try {
      const result = await this.workerConnection.blpop(this.queueName, 0);
    if (result) {
      const job = result[1];
      return job ? JSON.parse(job) : null;
    }
    return null;
    } catch (err) {
      console.error("Failed to get job from Redis queue:", err);
      throw err;
    }
  }
}

export default QueueService