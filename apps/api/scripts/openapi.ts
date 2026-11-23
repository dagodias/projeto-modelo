/**
 * Grava a especificação da API (a mesma que aparece em /api/docs) em apps/api/openapi.json.
 * Dela sai o cliente tipado da frente. Os dois passos juntos: pnpm contrato.
 */
import { writeFileSync } from 'node:fs'
import { criarServidor } from '../src/server.js'

const app = await criarServidor()
await app.ready()

const especificacao = JSON.stringify(app.swagger(), null, 2) + '\n'
writeFileSync(new URL('../openapi.json', import.meta.url), especificacao)

await app.close()
