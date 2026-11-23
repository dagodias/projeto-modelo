import Fastify, { type FastifyInstance } from 'fastify'
import { describe, expect, it } from 'vitest'
import { exigirGuard, guard } from '../src/lib/guard.js'

/** Uma API de teste com o exigirGuard ligado e uma rota só. */
async function subirCom(registrar: (app: FastifyInstance) => void) {
  const app = Fastify()
  exigirGuard(app)
  registrar(app)
  await app.ready()
  return app
}

describe('o guard em toda rota /api', () => {
  it('rota /api sem guard faz a API recusar subir', async () => {
    await expect(
      subirCom((app) => app.get('/api/aberta', async () => ({ ok: true }))),
    ).rejects.toThrow(/GET \/api\/aberta não tem guard/)
  })

  it('rota dentro de um plugin com o prefixo /api também é conferida', async () => {
    await expect(
      subirCom((app) =>
        app.register(
          async (filho: FastifyInstance) => {
            filho.post('/pedidos', async () => ({ ok: true }))
          },
          { prefix: '/api' },
        ),
      ),
    ).rejects.toThrow(/POST \/api\/pedidos não tem guard/)
  })

  it('com o guard, pública ou não, a API sobe', async () => {
    const app = await subirCom((app) => {
      app.get('/api/publica', { preHandler: guard({ publica: true }) }, async () => ({ ok: true }))
      app.get('/api/fechada', { preHandler: [guard({ publica: false })] }, async () => ({
        ok: true,
      }))
    })
    expect((await app.inject({ method: 'GET', url: '/api/publica' })).statusCode).toBe(200)
    expect((await app.inject({ method: 'GET', url: '/api/fechada' })).statusCode).toBe(401)
    await app.close()
  })

  it('outra função no preHandler não vale como guard', async () => {
    await expect(
      subirCom((app) =>
        app.get('/api/quase', { preHandler: async () => undefined }, async () => ({ ok: true })),
      ),
    ).rejects.toThrow(/não tem guard/)
  })

  it('o /api/docs e o que está fora do /api ficam de fora', async () => {
    const app = await subirCom((app) => {
      app.get('/api/docs/json', async () => ({}))
      app.get('/fora', async () => 'ok')
    })
    await app.close()
  })
})
