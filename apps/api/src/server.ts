/**
 * O Fastify e os plugins: segurança, cookies, limite de chamadas e a documentação (Swagger).
 * Toda rota /api/* precisa do guard (sem ele, a API não sobe) e o /api/docs só abre fora da produção (env.ts).
 */
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
import { docsAbertos, env } from './env.js'
import { exigirGuard } from './lib/guard.js'
import { negocioRoutes } from './routes/negocio.routes.js'
import { saudeRoutes } from './routes/saude.routes.js'

type Opcoes = {
  /** O /api/docs aberto? Sem dizer, segue o env.ts: fora da produção, sim; no ar, só com DOCS_NO_AR=true. */
  docs?: boolean
}

export async function criarServidor(opcoes: Opcoes = {}) {
  const docs = opcoes.docs ?? docsAbertos(env)
  const app = Fastify({
    logger: { level: env.NODE_ENV === 'test' ? 'silent' : 'info' },
    // O nginx e o Nuxt, na mesma máquina, repassam o IP de quem visita no X-Forwarded-For.
    // Só esse repasse vale: o cabeçalho que a pessoa inventar não troca o IP (nem fura o limite de chamadas).
    trustProxy: 'loopback',
  }).withTypeProvider<ZodTypeProvider>()

  // Antes de qualquer rota: daqui em diante, rota /api/* sem guard faz a API recusar subir.
  exigirGuard(app)

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
  // A especificação sempre existe (o pnpm contrato lê dela); a página /api/docs, só quando aberta.
  if (docs) await app.register(swaggerUi, { routePrefix: '/api/docs' })

  await app.register(saudeRoutes, { prefix: '/api' })
  await app.register(negocioRoutes, { prefix: '/api' })

  return app
}
