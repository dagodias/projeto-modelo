/**
 * O $api: o único jeito de a frente chamar a API.
 * Os caminhos, o que cada rota recebe e o que devolve vêm do contrato gerado da API (pnpm contrato):
 * se a API muda e a frente não acompanha, o erro aparece no pnpm typecheck, antes de rodar.
 * Na página montada no servidor, ele fala direto com a API e repassa o cookie e o IP de quem visita;
 * no navegador, chama /api, que o Nuxt (no computador) ou o nginx (no servidor) repassa para a API.
 */
import createClient from 'openapi-fetch'
import type { paths } from '~/types/api'

export default defineNuxtPlugin(() => {
  const api = createClient<paths>({
    baseUrl: import.meta.server ? useRuntimeConfig().apiInterna : '',
    headers: useRequestHeaders(['cookie', 'x-forwarded-for']),
  })

  return { provide: { api } }
})
