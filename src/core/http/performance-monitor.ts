import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
} from "fastify"

export const performanceMonitor: FastifyPluginCallback = (
  fastify: FastifyInstance,
  options,
  done
) => {
  fastify.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const start = process.hrtime.bigint()

      reply.raw.on("finish", () => {
        const end = process.hrtime.bigint()
        const duration = Number(end - start) / 1_000_000 // em milliseconds

        if (duration > 1000) {
          console.warn(
            `[SLOW] ${request.method} ${request.url} - ${duration.toFixed(2)}ms`
          )
        }
      })
    }
  )

  done() // Required for sync plugins
}
