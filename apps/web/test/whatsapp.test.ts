import { describe, expect, it } from 'vitest'
import { formatarTelefone, linkWhatsapp, mensagemDoSite } from '../app/utils/whatsapp'

describe('o link do WhatsApp', () => {
  it('limpa o número e escreve a mensagem no link', () => {
    expect(linkWhatsapp('55 (00) 00000-0000', 'Olá! Quero 2 lanches')).toBe(
      'https://wa.me/5500000000000?text=Ol%C3%A1!%20Quero%202%20lanches',
    )
  })

  it('a mensagem dos botões diz de onde a pessoa veio', () => {
    expect(mensagemDoSite('Lanchonete do Léo')).toBe('Olá! Vim pelo site de Lanchonete do Léo.')
  })
})

describe('o número na tela', () => {
  it('celular, com o 55 e o DDD, vira (DD) 99999-9999', () => {
    expect(formatarTelefone('5500912345678')).toBe('(00) 91234-5678')
  })

  it('fixo vira (DD) 9999-9999', () => {
    expect(formatarTelefone('550033334444')).toBe('(00) 3333-4444')
  })

  it('o que não reconhece, mostra como veio', () => {
    expect(formatarTelefone('123')).toBe('123')
  })
})
