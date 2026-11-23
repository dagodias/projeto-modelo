/** O link que abre o endereço no mapa. No celular, abre o aplicativo de mapas. */
export function linkMapa(endereco: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`
}
