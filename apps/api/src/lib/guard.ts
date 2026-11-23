/**
 * Quem pode chamar cada rota. Toda rota usa um guard, até a pública: { publica: true }.
 * O login ainda não está ligado (o comando /ligar-login liga): por enquanto, rota não pública responde 401.
 */
import type { FastifyReply, FastifyRequest } from 'fastify'

type Opcoes = { publica: boolean }

export function guard(opcoes: Opcoes) {
  return async function conferir(_request: FastifyRequest, reply: FastifyReply) {
    if (opcoes.publica) return
    return reply.code(401).send({ erro: 'nao_autenticado' })
  }
}
