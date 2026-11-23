/** O link que abre o WhatsApp com a mensagem já escrita, sem API. numero: com 55 e o DDD. */
export function linkWhatsapp(numero: string, mensagem: string): string {
  return `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`
}

/** A mensagem que os botões do site deixam escrita: quem recebe sabe de onde a pessoa veio. */
export function mensagemDoSite(nome: string): string {
  return `Olá! Vim pelo site de ${nome}.`
}

/** O número para mostrar na tela: 5511912345678 vira (11) 91234-5678. O que não reconhece, mostra como veio. */
export function formatarTelefone(numero: string): string {
  const digitos = numero.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')
  const ddd = digitos.slice(0, 2)
  const resto = digitos.slice(2)
  if (resto.length === 9) return `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}`
  if (resto.length === 8) return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`
  return numero
}
