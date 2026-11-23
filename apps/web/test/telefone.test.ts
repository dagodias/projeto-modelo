import { describe, expect, it } from 'vitest'
import { formatarTelefone, linkTelefone } from '../app/utils/telefone'

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

describe('o link de ligar', () => {
  it('leva o número inteiro, com o + do código do país', () => {
    expect(linkTelefone('5511912345678')).toBe('tel:+5511912345678')
    expect(linkTelefone('55 (11) 91234-5678')).toBe('tel:+5511912345678')
  })
})
