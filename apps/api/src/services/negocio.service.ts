/** As regras do negócio. A rota chama; quem decide é o service. */
import type { Horario, NegocioPublico } from '@projeto/shared'
import { negocio } from '../config/negocio.js'

const FUSO = 'America/Sao_Paulo'
const DIAS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** O dia da semana (0 é domingo) e os minutos desde a meia-noite, na hora de Brasília. */
export function agoraEmBrasilia(data: Date): { dia: number; minutos: number } {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: FUSO,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(data)
  const pegar = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? ''
  return {
    dia: DIAS.indexOf(pegar('weekday')),
    minutos: Number(pegar('hour')) * 60 + Number(pegar('minute')),
  }
}

function emMinutos(hora: string): number {
  const [h = 0, m = 0] = hora.split(':').map(Number)
  return h * 60 + m
}

/** Aberto agora? Aceita horário que passa da meia-noite, como das 18:00 às 02:00. */
export function estaAberto(horarios: Horario[], data: Date): boolean {
  const { dia, minutos } = agoraEmBrasilia(data)
  return horarios.some((h) => {
    const abre = emMinutos(h.abre)
    const fecha = emMinutos(h.fecha)
    if (fecha > abre) return h.dia === dia && minutos >= abre && minutos < fecha
    if (h.dia === dia && minutos >= abre) return true
    return (h.dia + 1) % 7 === dia && minutos < fecha
  })
}

/** O que quem visita vê: só os produtos disponíveis, e se está aberto agora. */
export function negocioPublico(data: Date = new Date()): NegocioPublico {
  return {
    ...negocio,
    produtos: negocio.produtos.filter((p) => p.disponivel),
    abertoAgora: estaAberto(negocio.horarios, data),
  }
}
