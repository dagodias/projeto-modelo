/** O Fastify e os plugins: segurança, cookies, limite de pedidos e a documentação (Swagger). */
import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { negocioRoutes } from './routes/negocio.routes.js'
import { saudeRoutes } from './routes/saude.routes.js'

export async function criarServidor() {
  const app = Fastify({
    logger: { level: process.env.NODE_ENV === 'test' ? 'silent' : 'info' },
    // No servidor, o nginx fica na frente: o IP de quem visita vem no cabeçalho dele.
    trustProxy: true,
  }).withTypeProvider<ZodTypeProvider>()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(helmet, { contentSecurityPolicy: false })
  await app.register(cookie)
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' })

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'A API do projeto',
        description: 'Toda rota aparece aqui, com o que recebe e o que devolve.',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })
  await app.register(swaggerUi, { routePrefix: '/api/docs' })

  await app.register(saudeRoutes, { prefix: '/api' })
  await app.register(negocioRoutes, { prefix: '/api' })

  return app
}
