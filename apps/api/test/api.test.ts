import { NegocioPublicoSchema } from '@projeto/shared'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { criarServidor } from '../src/server.js'

let app: Awaited<ReturnType<typeof criarServidor>>

beforeAll(async () => {
  app = await criarServidor()
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('a API', () => {
  it('responde na rota de saúde', async () => {
    const resposta = await app.inject({ method: 'GET', url: '/api/saude' })
    expect(resposta.statusCode).toBe(200)
    expect(resposta.json().ok).toBe(true)
  })

  it('devolve o negócio no formato do contrato', async () => {
    const resposta = await app.inject({ method: 'GET', url: '/api/negocio' })
    expect(resposta.statusCode).toBe(200)
    expect(NegocioPublicoSchema.safeParse(resposta.json()).success).toBe(true)
  })

  it('documenta as rotas no Swagger', async () => {
    const resposta = await app.inject({ method: 'GET', url: '/api/docs/json' })
    expect(resposta.statusCode).toBe(200)
    expect(Object.keys(resposta.json().paths)).toContain('/api/negocio')
  })
})
