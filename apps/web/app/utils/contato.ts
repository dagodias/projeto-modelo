/**
 * Os jeitos de falar com o negócio, na ordem em que aparecem no contato e no rodapé: o telefone, o WhatsApp
 * (só se o número atende nele) e o e-mail (só se o negócio tem). Os dados vêm da API; aqui é só o jeito de mostrar.
 */
import type { Negocio } from '@projeto/shared'
import { formatarTelefone, linkTelefone } from './telefone'
import { linkWhatsapp, mensagemDoSite } from './whatsapp'

export type Canal = {
  tipo: 'telefone' | 'whatsapp' | 'email'
  /** O nome do canal na tela. */
  rotulo: string
  /** O que aparece depois do nome: o número formatado ou o e-mail. */
  valor: string
  /**
   * O valor em pedaços: na tela, a linha só quebra entre eles (com um <wbr> no meio). O e-mail comprido quebra
   * depois do @, nunca no meio do nome.
   */
  pedacos: string[]
  /** O endereço do link: tel:, wa.me ou mailto:. */
  link: string
}

export function canaisDeContato(
  negocio: Pick<Negocio, 'nome' | 'telefone' | 'temWhatsapp' | 'email'>,
): Canal[] {
  const numero = formatarTelefone(negocio.telefone)
  const canais: Canal[] = [
    {
      tipo: 'telefone',
      rotulo: 'Telefone',
      valor: numero,
      pedacos: [numero],
      link: linkTelefone(negocio.telefone),
    },
  ]
  if (negocio.temWhatsapp) {
    canais.push({
      tipo: 'whatsapp',
      rotulo: 'WhatsApp',
      valor: numero,
      pedacos: [numero],
      link: linkWhatsapp(negocio.telefone, mensagemDoSite(negocio.nome)),
    })
  }
  if (negocio.email) {
    const arroba = negocio.email.lastIndexOf('@') + 1
    canais.push({
      tipo: 'email',
      rotulo: 'E-mail',
      valor: negocio.email,
      pedacos: [negocio.email.slice(0, arroba), negocio.email.slice(arroba)],
      link: `mailto:${negocio.email}`,
    })
  }
  return canais
}
