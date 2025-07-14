import { AxiosError } from "axios"
import { FastifyReply, FastifyRequest } from "fastify"

export function HandleError(
  error: any,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500
    const message =
      error.response?.data?.error || error.message || "Axios Error"
    return reply.status(status).send({
      error: message,
    })
  }
  console.error("(Internal Server Error)", error)
  return reply.status(500).send({
    error: "Internal Server Error",
  })
}
