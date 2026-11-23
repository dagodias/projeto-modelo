/**
 * O horário para mostrar na tela, resumido: os dias seguidos com o mesmo horário viram uma linha só.
 * [terça a domingo, 18:00 às 23:00] vira { dias: 'Terça a domingo', horas: '18h às 23h' }.
 * Quem decide se está aberto agora é a API; aqui é só o jeito de mostrar.
 */
import type { Horario } from '@projeto/shared'

const NOMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
// A semana como se fala no Brasil: de segunda a domingo.
const ORDEM = [1, 2, 3, 4, 5, 6, 0]

/** 18:00 vira 18h; 18:30 vira 18h30. */
export function formatarHora(hora: string): string {
  const [h = '0', m = '00'] = hora.split(':')
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`
}

function horasDoDia(horarios: Horario[], dia: number): string {
  const doDia = horarios
    .filter((h) => h.dia === dia)
    .sort((a, b) => a.abre.localeCompare(b.abre))
    .map((h) => `${formatarHora(h.abre)} às ${formatarHora(h.fecha)}`)
  return doDia.length ? doDia.join(' e ') : 'Fechado'
}

function maiuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function resumirHorarios(horarios: Horario[]): { dias: string; horas: string }[] {
  const grupos: { de: number; ate: number; quantos: number; horas: string }[] = []
  for (const dia of ORDEM) {
    const horas = horasDoDia(horarios, dia)
    const ultimo = grupos.at(-1)
    if (ultimo && ultimo.horas === horas) {
      ultimo.ate = dia
      ultimo.quantos++
    } else {
      grupos.push({ de: dia, ate: dia, quantos: 1, horas })
    }
  }
  return grupos.map((g) => {
    const de = maiuscula(NOMES[g.de] ?? '')
    const ate = NOMES[g.ate] ?? ''
    const dias = g.quantos === 1 ? de : g.quantos === 2 ? `${de} e ${ate}` : `${de} a ${ate}`
    return { dias, horas: g.horas }
  })
}
