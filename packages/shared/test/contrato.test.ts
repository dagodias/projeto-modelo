import { describe, expect, it } from 'vitest'
import { formatarPreco, ProdutoSchema, RedeSchema } from '../src/index.js'

describe('o contrato', () => {
  it('mostra centavos como reais', () => {
    expect(formatarPreco(2200)).toBe('R$ 22,00')
    expect(formatarPreco(1999)).toBe('R$ 19,99')
  })

  it('recusa preço quebrado: dinheiro é sempre em centavos inteiros', () => {
    const produto = {
      id: 'x',
      nome: 'X',
      descricao: '',
      precoCentavos: 22.5,
      foto: null,
      disponivel: true,
    }
    expect(ProdutoSchema.safeParse(produto).success).toBe(false)
  })

  it('a rede social só aceita endereço http ou https', () => {
    expect(
      RedeSchema.safeParse({ nome: 'Instagram', endereco: 'https://www.instagram.com/' }).success,
    ).toBe(true)
    expect(RedeSchema.safeParse({ nome: 'Golpe', endereco: 'javascript:alert(1)' }).success).toBe(
      false,
    )
  })
})
