// import * as amqp from "amqplib"
// import { Connection } from "amqplib"

// type RabbitMQConfig = {
//   host: string
//   port: number
//   user: string
//   password: string
// }

// const getRabbitMQConfig = (): RabbitMQConfig => ({
//   host: process.env.RABBITMQ_HOST || "localhost",
//   port: parseInt(process.env.RABBITMQ_PORT || "5672", 10),
//   user: process.env.RABBITMQ_USER || "guest",
//   password: process.env.RABBITMQ_PASSWORD || "guest",
// })

// export const createRabbitMQConnection = async (
//   config: RabbitMQConfig = getRabbitMQConfig()
// ): Promise<Connection> => {
//   return amqp.connect({
//     protocol: "amqp",
//     hostname: config.host,
//     port: config.port,
//     username: config.user,
//     password: config.password,
//   })
// }
