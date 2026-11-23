import { describe, expect, it } from 'vitest'
import { negocio } from '../src/config/negocio.js'
import { estaAberto, negocioPublico } from '../src/services/negocio.service.js'

// Brasília é UTC-3: 22:00 em UTC são 19:00 em Brasília.
// 24/11/2026 é uma terça-feira (dia 2); 28/11/2026, um sábado (dia 6).
describe('aberto agora', () => {
  const terca = [{ dia: 2, abre: '18:00', fecha: '23:00' }]

  it('aberto dentro do horário', () => {
    expect(estaAberto(terca, new Date('2026-11-24T22:00:00Z'))).toBe(true)
  })

  it('fechado fora do horário', () => {
    expect(estaAberto(terca, new Date('2026-11-24T12:00:00Z'))).toBe(false)
  })

  it('horário que passa da meia-noite vale na madrugada seguinte', () => {
    const sexta = [{ dia: 5, abre: '18:00', fecha: '02:00' }]
    expect(estaAberto(sexta, new Date('2026-11-28T04:30:00Z'))).toBe(true)
    expect(estaAberto(sexta, new Date('2026-11-28T06:00:00Z'))).toBe(false)
  })
})

describe('o que quem visita vê', () => {
  it('o produto em falta some do site, sem ser apagado', () => {
    const emFalta = negocio.produtos.filter((p) => !p.disponivel).map((p) => p.id)
    const publicos = negocioPublico().produtos
    expect(publicos.every((p) => p.disponivel)).toBe(true)
    expect(publicos.some((p) => emFalta.includes(p.id))).toBe(false)
  })
})
