import { FastifyReply, FastifyRequest } from "fastify"

export function HandleError(
  error: any,
  request: FastifyRequest,
  reply: FastifyReply
) {
  console.error("(Internal Server Error)", error)
  return reply.status(500).send({
    error: "Internal Server Error",
  })
}
