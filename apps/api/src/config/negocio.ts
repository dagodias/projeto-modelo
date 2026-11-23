/**
 * Os dados do negócio, num lugar só. Troque pelos do seu.
 * Quando o projeto ganhar o painel do dono, eles vão para o banco (o comando /ligar-banco).
 */
import type { Negocio } from '@projeto/shared'

export const negocio: Negocio = {
  nome: 'Meu Negócio',
  frase: 'Troque esta frase pelo que o seu negócio faz.',
  // Número de exemplo: troque pelo da loja, só dígitos, com 55 e o DDD.
  whatsapp: '5500000000000',
  endereco: 'Rua de Exemplo, 100, Centro',
  horarios: [
    { dia: 2, abre: '18:00', fecha: '23:00' },
    { dia: 3, abre: '18:00', fecha: '23:00' },
    { dia: 4, abre: '18:00', fecha: '23:00' },
    { dia: 5, abre: '18:00', fecha: '23:00' },
    { dia: 6, abre: '18:00', fecha: '23:00' },
    { dia: 0, abre: '18:00', fecha: '23:00' },
  ],
  produtos: [
    {
      id: 'exemplo-1',
      nome: 'Produto de exemplo',
      descricao: 'Troque pelos seus produtos.',
      precoCentavos: 2000,
      foto: null,
      disponivel: true,
    },
  ],
}
