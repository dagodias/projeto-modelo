import { describe, expect, it } from 'vitest'
import { linkWhatsapp } from '../app/utils/whatsapp'

describe('o link do WhatsApp', () => {
  it('limpa o número e escreve a mensagem no link', () => {
    expect(linkWhatsapp('55 (00) 00000-0000', 'Olá! Quero 2 lanches')).toBe(
      'https://wa.me/5500000000000?text=Ol%C3%A1!%20Quero%202%20lanches',
    )
  })
})
