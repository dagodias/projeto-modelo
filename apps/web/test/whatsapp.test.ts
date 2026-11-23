import { describe, expect, it } from 'vitest'
import { linkWhatsapp, mensagemDoSite } from '../app/utils/whatsapp'

describe('o link do WhatsApp', () => {
  it('limpa o número e escreve a mensagem no link', () => {
    expect(linkWhatsapp('55 (00) 00000-0000', 'Olá! Quero 2 unidades')).toBe(
      'https://wa.me/5500000000000?text=Ol%C3%A1!%20Quero%202%20unidades',
    )
  })

  it('a mensagem do botão diz de onde a pessoa veio', () => {
    expect(mensagemDoSite('Meu Negócio')).toBe('Olá! Vim pelo site de Meu Negócio.')
  })
})
