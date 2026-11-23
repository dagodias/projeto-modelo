import { describe, expect, it } from 'vitest'
import { ehPaginaPrivada } from '../app/utils/privadas'

describe('as páginas privadas', () => {
  it('o painel, a entrada e o pedido, com o que vem depois deles', () => {
    for (const caminho of ['/painel', '/painel/pedidos', '/entrar', '/pedido/abc123']) {
      expect(ehPaginaPrivada(caminho), caminho).toBe(true)
    }
  })

  it('as outras páginas, e as que só começam parecido, não', () => {
    for (const caminho of ['/', '/contato', '/pedidos-antigos', '/painelzinho', '/entrada']) {
      expect(ehPaginaPrivada(caminho), caminho).toBe(false)
    }
  })
})
