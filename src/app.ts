import fastify from "fastify"
import "reflect-metadata"
import { paymentsRoutes } from "./http/payments.routes"
import { HandleError } from "./http/handleError"

export function buildApp() {
  const app = fastify({
    logger: {
      level: "error",
    },
  })

  app.removeContentTypeParser("application/json")
  app.addContentTypeParser(
    "application/json",
    { parseAs: "string" },
    (req, body, done) => {
      if (!body) {
        done(null, {}) // ou null
      } else {
        try {
          const jsonString = typeof body === "string" ? body : body.toString()
          done(null, JSON.parse(jsonString))
        } catch (err) {
          done(err instanceof Error ? err : new Error(String(err)))
        }
      }
    }
  )
  app.register(paymentsRoutes)
  app.setErrorHandler(HandleError)

  return app
}
