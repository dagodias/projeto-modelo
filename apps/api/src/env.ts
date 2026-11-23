/** As configurações da API, conferidas na subida: se faltar ou vier errado, ela nem liga. */
import { existsSync } from 'node:fs'
import { z } from 'zod'

if (existsSync('.env')) process.loadEnvFile('.env')

const Configuracao = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORTA: z.coerce.number().int().default(3333),
  HOST: z.string().default('127.0.0.1'),
})

const lida = Configuracao.safeParse(process.env)
if (!lida.success) {
  console.error('Configuração inválida no .env:\n' + z.prettifyError(lida.error))
  process.exit(1)
}

export const env = lida.data
