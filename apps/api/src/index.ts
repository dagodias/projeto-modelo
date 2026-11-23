import { env } from './env.js'
import { criarServidor } from './server.js'

const app = await criarServidor()

try {
  await app.listen({ port: env.PORTA, host: env.HOST })
} catch (erro) {
  app.log.error(erro)
  process.exit(1)
}
