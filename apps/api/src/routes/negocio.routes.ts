import { NegocioPublicoSchema } from '@projeto/shared'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { guard } from '../lib/guard.js'
import { negocioPublico } from '../services/negocio.service.js'

export const negocioRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/negocio',
    {
      preHandler: guard({ publica: true }),
      schema: {
        tags: ['negócio'],
        summary:
          'Os dados públicos do negócio: nome, horários, produtos disponíveis e se está aberto agora',
        response: { 200: NegocioPublicoSchema },
      },
    },
    async () => negocioPublico(),
  )
}
