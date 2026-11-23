import { describe, expect, it } from 'vitest'
import { canaisDeContato } from '../app/utils/contato'

const negocio = { nome: 'Meu Negócio', telefone: '5511912345678', temWhatsapp: false }

describe('os jeitos de falar com o negócio', () => {
  it('o telefone aparece sempre, com o link de ligar', () => {
    expect(canaisDeContato(negocio)).toEqual([
      {
        tipo: 'telefone',
        rotulo: 'Telefone',
        valor: '(11) 91234-5678',
        pedacos: ['(11) 91234-5678'],
        link: 'tel:+5511912345678',
      },
    ])
  })

  it('o WhatsApp só aparece quando o número atende nele', () => {
    const canais = canaisDeContato({ ...negocio, temWhatsapp: true })
    expect(canais.map((canal) => canal.tipo)).toEqual(['telefone', 'whatsapp'])
    expect(canais[1]?.link).toBe(
      'https://wa.me/5511912345678?text=Ol%C3%A1!%20Vim%20pelo%20site%20de%20Meu%20Neg%C3%B3cio.',
    )
  })

  it('o e-mail só aparece quando o negócio tem', () => {
    const canais = canaisDeContato({ ...negocio, email: 'contato@exemplo.com.br' })
    expect(canais.map((canal) => canal.tipo)).toEqual(['telefone', 'email'])
    expect(canais[1]?.link).toBe('mailto:contato@exemplo.com.br')
  })

  it('o e-mail comprido quebra a linha depois do @, não no meio do nome', () => {
    const [, email] = canaisDeContato({ ...negocio, email: 'contato@exemplo.com.br' })
    expect(email?.pedacos).toEqual(['contato@', 'exemplo.com.br'])
    expect(email?.pedacos.join('')).toBe(email?.valor)
  })
})
