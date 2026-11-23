/**
 * O contrato: o formato dos dados que a frente e a API trocam.
 * Os dois lados importam daqui, então uma mudança vale para os dois.
 */
import { z } from 'zod'

/** Um dia de funcionamento. dia: 0 é domingo, 6 é sábado. Horas no formato HH:MM, na hora de Brasília. */
export const HorarioSchema = z.object({
  dia: z.number().int().min(0).max(6),
  abre: z.string().regex(/^\d{2}:\d{2}$/),
  fecha: z.string().regex(/^\d{2}:\d{2}$/),
})

export const ProdutoSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  descricao: z.string(),
  /** Dinheiro sempre em centavos, número inteiro: R$ 22,00 é 2200. */
  precoCentavos: z.number().int().nonnegative(),
  foto: z.string().nullable(),
  disponivel: z.boolean(),
})

/** Uma rede social do negócio: o nome que aparece no site e o endereço completo, só http ou https. */
export const RedeSchema = z.object({
  nome: z.string().min(1),
  endereco: z.httpUrl(),
})

export const NegocioSchema = z.object({
  nome: z.string().min(1),
  frase: z.string(),
  /** Só dígitos, com 55 e o DDD. */
  whatsapp: z.string().regex(/^\d{12,13}$/),
  endereco: z.string(),
  horarios: z.array(HorarioSchema),
  produtos: z.array(ProdutoSchema),
  redes: z.array(RedeSchema),
})

/** O que a API mostra para quem visita: o negócio e se ele está aberto agora. */
export const NegocioPublicoSchema = NegocioSchema.extend({
  abertoAgora: z.boolean(),
})

export type Horario = z.infer<typeof HorarioSchema>
export type Produto = z.infer<typeof ProdutoSchema>
export type Rede = z.infer<typeof RedeSchema>
export type Negocio = z.infer<typeof NegocioSchema>
export type NegocioPublico = z.infer<typeof NegocioPublicoSchema>

/** Mostra centavos como dinheiro: 2200 vira "R$ 22,00". */
export function formatarPreco(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    centavos / 100,
  )
}
