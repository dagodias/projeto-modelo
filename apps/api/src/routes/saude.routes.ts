import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { guard } from '../lib/guard.js'

export const saudeRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/saude',
    {
      preHandler: guard({ publica: true }),
      schema: {
        tags: ['sistema'],
        summary: 'Confere se a API está no ar',
        response: { 200: z.object({ ok: z.literal(true), hora: z.string() }) },
      },
    },
    async () => ({ ok: true as const, hora: new Date().toISOString() }),
  )
}
