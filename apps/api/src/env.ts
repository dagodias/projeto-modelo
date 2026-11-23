/** As configurações da API, conferidas na subida: se faltar ou vier errado, ela nem liga. */
import { existsSync } from 'node:fs'
import { z } from 'zod'

if (existsSync('.env')) process.loadEnvFile('.env')

const Configuracao = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORTA: z.coerce.number().int().default(3333),
  HOST: z.string().default('127.0.0.1'),
  /** O Swagger (/api/docs) no ar: fechado, a menos que o .env do servidor tenha DOCS_NO_AR=true. */
  DOCS_NO_AR: z.stringbool().default(false),
})

const lida = Configuracao.safeParse(process.env)
if (!lida.success) {
  console.error('Configuração inválida no .env:\n' + z.prettifyError(lida.error))
  process.exit(1)
}

export const env = lida.data

/**
 * O Swagger (/api/docs) abre no computador e nos testes. No ar (produção), ele mostraria a qualquer um o mapa de todas
 * as rotas: fica fechado, a menos que DOCS_NO_AR=true. O pnpm contrato não depende dele.
 */
export function docsAbertos(config: Pick<typeof env, 'NODE_ENV' | 'DOCS_NO_AR'>): boolean {
  return config.NODE_ENV !== 'production' || config.DOCS_NO_AR
}
