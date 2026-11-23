/**
 * Quem pode chamar cada rota. Toda rota usa um guard, até a pública: { publica: true }.
 * O login ainda não está ligado (o comando /ligar-login liga): por enquanto, rota não pública responde 401.
 * E rota /api/* sem guard nem sobe: o exigirGuard faz a API recusar ligar (o esquecimento vira erro na hora, e não uma
 * rota aberta no ar).
 */
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

type Opcoes = { publica: boolean }

/** A marca que o guard deixa na função: é por ela que o exigirGuard reconhece a rota protegida. */
const MARCA = Symbol.for('projeto.guard')

export function guard(opcoes: Opcoes) {
  async function conferir(_request: FastifyRequest, reply: FastifyReply) {
    if (opcoes.publica) return
    return reply.code(401).send({ erro: 'nao_autenticado' })
  }
  return Object.assign(conferir, { [MARCA]: true })
}

/** O /api/docs (o Swagger) é a documentação, não uma rota do projeto: fica de fora. */
function precisaDeGuard(url: string): boolean {
  return url.startsWith('/api/') && url !== '/api/docs' && !url.startsWith('/api/docs/')
}

/** Toda rota /api/* registrada depois desta chamada precisa do guard no preHandler; sem ele, a API não sobe. */
export function exigirGuard(app: Pick<FastifyInstance, 'addHook'>) {
  app.addHook('onRoute', (rota) => {
    if (!precisaDeGuard(rota.url)) return
    const etapas: unknown[] = [rota.preHandler].flat()
    const protegida = etapas.some((etapa) => typeof etapa === 'function' && MARCA in etapa)
    if (!protegida) {
      throw new Error(
        `A rota ${String(rota.method)} ${rota.url} não tem guard. Ponha no preHandler o guard({ publica: true }) ` +
          'ou o guard({ publica: false }): sem ele, a API não sobe.',
      )
    }
  })
}
