/**
 * As páginas privadas: o painel do dono, a entrada com senha e o acompanhamento do pedido (o link do cliente leva um
 * código secreto). Elas não ficam guardadas no navegador nem no Google, não passam o endereço para outro site e não
 * ganham o endereço oficial (canonical) nem o og:url. Quem lê esta lista: o server/middleware/seguranca.ts (os cabeçalhos) e o layout.
 * Página privada nova entra aqui.
 */
export const PAGINAS_PRIVADAS = ['/painel', '/entrar', '/pedido'] as const

/** /painel, /painel/pedidos e /pedido/abc123 são privadas; /pedidos-antigos não. */
export function ehPaginaPrivada(caminho: string): boolean {
  return PAGINAS_PRIVADAS.some((base) => caminho === base || caminho.startsWith(`${base}/`))
}
