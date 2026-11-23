import { NegocioPublicoSchema } from '@projeto/shared'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { docsAbertos } from '../src/env.js'
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

  it('limita as chamadas por visitante, sem cair no IP inventado', async () => {
    // O nginx acrescenta o IP verdadeiro no fim do X-Forwarded-For; o começo, quem visita pode inventar.
    const pedir = (inventado: number) =>
      app.inject({
        method: 'GET',
        url: '/api/saude',
        headers: { 'x-forwarded-for': `10.0.0.${inventado}, 203.0.113.9` },
      })
    for (let i = 0; i < 100; i++) expect((await pedir(i)).statusCode).toBe(200)
    expect((await pedir(100)).statusCode).toBe(429)
  })

  it('documenta as rotas no Swagger', async () => {
    const resposta = await app.inject({ method: 'GET', url: '/api/docs/json' })
    expect(resposta.statusCode).toBe(200)
    expect(Object.keys(resposta.json().paths)).toContain('/api/negocio')
  })

  it('no ar, o /api/docs fica fechado (e o contrato continua saindo da API)', async () => {
    const noAr = await criarServidor({ docs: false })
    await noAr.ready()
    for (const url of ['/api/docs', '/api/docs/json']) {
      expect((await noAr.inject({ method: 'GET', url })).statusCode, url).toBe(404)
    }
    expect(Object.keys(noAr.swagger().paths ?? {})).toContain('/api/negocio')
    await noAr.close()
  })
})

describe('o /api/docs no ar', () => {
  it('abre fora da produção', () => {
    expect(docsAbertos({ NODE_ENV: 'development', DOCS_NO_AR: false })).toBe(true)
    expect(docsAbertos({ NODE_ENV: 'test', DOCS_NO_AR: false })).toBe(true)
  })

  it('em produção, só com DOCS_NO_AR=true', () => {
    expect(docsAbertos({ NODE_ENV: 'production', DOCS_NO_AR: false })).toBe(false)
    expect(docsAbertos({ NODE_ENV: 'production', DOCS_NO_AR: true })).toBe(true)
  })
})
