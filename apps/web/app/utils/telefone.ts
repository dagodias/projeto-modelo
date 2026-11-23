/** O número para mostrar na tela: 5511912345678 vira (11) 91234-5678. O que não reconhece, mostra como veio. */
export function formatarTelefone(numero: string): string {
  const digitos = numero.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '')
  const ddd = digitos.slice(0, 2)
  const resto = digitos.slice(2)
  if (resto.length === 9) return `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}`
  if (resto.length === 8) return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`
  return numero
}

/** O link que liga para o número (no celular, abre o discador): 5511912345678 vira tel:+5511912345678. */
export function linkTelefone(numero: string): string {
  return `tel:+${numero.replace(/\D/g, '')}`
}
