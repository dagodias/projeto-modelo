/** O link que abre o WhatsApp com a mensagem já escrita, sem API. numero: com 55 e o DDD. */
export function linkWhatsapp(numero: string, mensagem: string): string {
  return `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`
}
