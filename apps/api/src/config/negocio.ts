/**
 * Os dados do negócio, num lugar só. Troque pelos do seu.
 * Com o banco ligado (o comando /ligar-banco), o negócio passa a morar nele e este arquivo vira a semente;
 * os produtos ficam aqui até o catálogo ir para o banco.
 */
import type { Negocio } from '@projeto/shared'

export const negocio: Negocio = {
  nome: 'Meu Negócio',
  frase: 'Troque esta frase pelo que o seu negócio faz.',
  // O telefone de exemplo: troque pelo do negócio, só dígitos, com 55 e o DDD.
  telefone: '5500000000000',
  // O mesmo número atende no WhatsApp? Com true, o contato e o rodapé mostram o botão dele; com false, não.
  temWhatsapp: true,
  // O e-mail de contato. O negócio não tem? Apague a linha.
  email: 'contato@meunegocio.example',
  endereco: 'Rua de Exemplo, 100, Centro',
  // Um dia por linha (0 é domingo, 6 é sábado), na hora de Brasília. O dia que não está aqui é fechado.
  horarios: [
    { dia: 1, abre: '09:00', fecha: '18:00' },
    { dia: 2, abre: '09:00', fecha: '18:00' },
    { dia: 3, abre: '09:00', fecha: '18:00' },
    { dia: 4, abre: '09:00', fecha: '18:00' },
    { dia: 5, abre: '09:00', fecha: '18:00' },
    { dia: 6, abre: '09:00', fecha: '13:00' },
  ],
  produtos: [
    {
      id: 'exemplo-1',
      nome: 'Produto de exemplo',
      descricao: 'Troque pelos seus produtos, cada um com uma descrição curta.',
      precoCentavos: 2000,
      foto: null,
      disponivel: true,
    },
    {
      id: 'exemplo-2',
      nome: 'Outro produto',
      descricao: 'O preço é sempre em centavos, número inteiro: 3550 vira R$ 35,50.',
      precoCentavos: 3550,
      foto: null,
      disponivel: true,
    },
    {
      id: 'exemplo-3',
      nome: 'Serviço de exemplo',
      descricao: 'Também serve para serviço: um corte, uma aula, uma consulta.',
      precoCentavos: 5000,
      foto: null,
      disponivel: true,
    },
    {
      id: 'exemplo-4',
      nome: 'Produto em falta',
      descricao: 'Com disponivel: false, ele some do site sem ser apagado.',
      precoCentavos: 1500,
      foto: null,
      disponivel: false,
    },
  ],
  // As redes sociais, na ordem em que aparecem no rodapé. Troque pelo endereço do seu perfil, ou apague.
  redes: [{ nome: 'Instagram', endereco: 'https://www.instagram.com/' }],
}
