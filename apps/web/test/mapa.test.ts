import { describe, expect, it } from 'vitest'
import { linkMapa } from '../app/utils/mapa'

describe('o link do mapa', () => {
  it('leva o endereço, codificado, para o mapa', () => {
    expect(linkMapa('Rua de Exemplo, 100, Centro')).toBe(
      'https://www.google.com/maps/search/?api=1&query=Rua%20de%20Exemplo%2C%20100%2C%20Centro',
    )
  })
})
