import { describe, expect, it } from 'vitest'
import { formatarHora, resumirHorarios } from '../app/utils/horario'

const noite = (dia: number) => ({ dia, abre: '18:00', fecha: '23:00' })

describe('o horário na tela', () => {
  it('mostra a hora cheia sem os minutos', () => {
    expect(formatarHora('18:00')).toBe('18h')
    expect(formatarHora('09:30')).toBe('9h30')
  })

  it('junta os dias seguidos com o mesmo horário, de segunda a domingo', () => {
    expect(resumirHorarios([2, 3, 4, 5, 6, 0].map(noite))).toEqual([
      { dias: 'Segunda', horas: 'Fechado' },
      { dias: 'Terça a domingo', horas: '18h às 23h' },
    ])
  })

  it('dois dias viram "e", e o almoço e o jantar ficam na mesma linha', () => {
    const fimDeSemana = [
      { dia: 6, abre: '18:00', fecha: '23:00' },
      { dia: 6, abre: '11:00', fecha: '14:00' },
      { dia: 0, abre: '11:00', fecha: '14:00' },
      { dia: 0, abre: '18:00', fecha: '23:00' },
    ]
    expect(resumirHorarios(fimDeSemana)).toEqual([
      { dias: 'Segunda a sexta', horas: 'Fechado' },
      { dias: 'Sábado e domingo', horas: '11h às 14h e 18h às 23h' },
    ])
  })
})
