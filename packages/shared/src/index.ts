/**
 * O contrato: o formato dos dados que a frente e a API trocam.
 * Os dois lados importam daqui, então uma mudança vale para os dois.
 */
import { z } from 'zod'

/** Uma hora do dia, de 00:00 a 23:59. */
const Hora = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)

/**
 * Um dia de funcionamento. dia: 0 é domingo, 6 é sábado. Horas de 00:00 a 23:59, na hora de Brasília.
 * Abre e fecha diferentes (iguais deixariam o negócio aberto o dia todo sem querer); fechar antes de abrir passa da
 * meia-noite (das 18:00 às 02:00).
 */
export const HorarioSchema = z
  .object({ dia: z.number().int().min(0).max(6), abre: Hora, fecha: Hora })
  .refine((horario) => horario.abre !== horario.fecha, {
    message: 'O horário de abrir e o de fechar não podem ser iguais.',
    path: ['fecha'],
  })

export const ProdutoSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  descricao: z.string(),
  /** Dinheiro sempre em centavos, número inteiro: R$ 22,00 é 2200. */
  precoCentavos: z.number().int().nonnegative(),
  /**
   * A foto mora no próprio site (/fotos/<arquivo>), nunca num endereço de fora; sem foto, null. Cada parte do caminho
   * começa por letra ou número: nada de "..", nem arquivo escondido.
   */
  foto: z
    .string()
    .regex(/^\/fotos(\/[A-Za-z0-9][\w.-]*)+$/)
    .nullable(),
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
  /** O telefone do negócio: só dígitos, com 55 e o DDD (5511912345678). */
  telefone: z.string().regex(/^55\d{10,11}$/),
  /** O mesmo número também atende no WhatsApp? Com true, o site mostra o botão dele no contato e no rodapé. */
  temWhatsapp: z.boolean(),
  /** O e-mail de contato, se o negócio tiver. */
  email: z.email().optional(),
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
