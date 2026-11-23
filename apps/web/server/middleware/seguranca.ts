/**
 * Os cabeçalhos de segurança de toda página, e os das páginas privadas (app/utils/privadas.ts).
 * Num middleware, e não nas routeRules do nuxt.config.ts: lá, a regra geral (/**) ganha da regra da página privada.
 * O /api fica de fora: no servidor, o nginx manda o /api direto para a API, que tem os cabeçalhos dela.
 */
import { ehPaginaPrivada } from '../../app/utils/privadas'

// O navegador não adivinha o tipo do arquivo, o site não abre dentro de outro site, o endereço não vaza inteiro para
// outro site e a página não pede câmera, microfone nem localização.
const seguranca = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
}
// As páginas privadas: nada guardado, o endereço (com o código do pedido) não passa adiante, e fora do Google.
const privada = {
  'cache-control': 'no-store',
  'referrer-policy': 'no-referrer',
  'x-robots-tag': 'noindex, nofollow',
}

export default defineEventHandler((event) => {
  const caminho = event.path.split('?')[0] ?? '/'
  if (caminho === '/api' || caminho.startsWith('/api/')) return
  // A página de erro (o 404) é montada num pedido interno, /__nuxt_error?url=<o endereço pedido>, e os cabeçalhos dele
  // vão para a resposta: vale o endereço que a pessoa pediu.
  const pedido =
    caminho === '/__nuxt_error' ? String(getQuery(event).url ?? '/').split('?')[0] : caminho
  setResponseHeaders(event, seguranca)
  // No ar, o navegador passa a entrar sempre pelo https (o HSTS). No computador (pnpm dev), não: lá não há cadeado.
  if (!import.meta.dev) setResponseHeader(event, 'strict-transport-security', 'max-age=31536000')
  if (ehPaginaPrivada(pedido ?? '/')) setResponseHeaders(event, privada)
})
