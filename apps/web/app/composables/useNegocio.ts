/**
 * Os dados do negócio que a API mostra para quem visita (GET /api/negocio).
 * O layout pede uma vez e passa para o topo e o rodapé; a página que também precisa chama de novo:
 * com a mesma chave, o Nuxt aproveita a mesma chamada.
 */
import type { NuxtApp } from '#app'

async function buscarNegocio(nuxtApp: NuxtApp) {
  // O caminho e o formato da resposta vêm do contrato: o editor completa e o typecheck confere.
  const { data } = await nuxtApp.$api.GET('/api/negocio')
  if (!data) throw createError({ statusCode: 502, statusMessage: 'A API não respondeu' })
  return data
}

export function useNegocio() {
  return useAsyncData('negocio', buscarNegocio)
}
