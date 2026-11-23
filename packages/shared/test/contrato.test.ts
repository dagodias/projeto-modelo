import { describe, expect, it } from 'vitest'
import {
  formatarPreco,
  HorarioSchema,
  NegocioSchema,
  ProdutoSchema,
  RedeSchema,
} from '../src/index.js'

const negocio = {
  nome: 'Meu Negócio',
  frase: '',
  telefone: '5511912345678',
  temWhatsapp: false,
  endereco: '',
  horarios: [],
  produtos: [],
  redes: [],
}

describe('o contrato', () => {
  it('mostra centavos como reais', () => {
    expect(formatarPreco(2200)).toBe('R$ 22,00')
    expect(formatarPreco(1999)).toBe('R$ 19,99')
  })

  it('recusa preço quebrado: dinheiro é sempre em centavos inteiros', () => {
    const produto = {
      id: 'x',
      nome: 'X',
      descricao: '',
      precoCentavos: 22.5,
      foto: null,
      disponivel: true,
    }
    expect(ProdutoSchema.safeParse(produto).success).toBe(false)
  })

  it('a rede social só aceita endereço http ou https', () => {
    expect(
      RedeSchema.safeParse({ nome: 'Instagram', endereco: 'https://www.instagram.com/' }).success,
    ).toBe(true)
    expect(RedeSchema.safeParse({ nome: 'Golpe', endereco: 'javascript:alert(1)' }).success).toBe(
      false,
    )
  })

  it('o telefone é só dígitos, com 55 e o DDD', () => {
    expect(NegocioSchema.safeParse(negocio).success).toBe(true)
    expect(NegocioSchema.safeParse({ ...negocio, telefone: '551133334444' }).success).toBe(true)
    for (const telefone of ['11912345678', '(11) 91234-5678', '55119123456789']) {
      expect(NegocioSchema.safeParse({ ...negocio, telefone }).success, telefone).toBe(false)
    }
  })

  it('o e-mail é opcional, mas, se vier, precisa ser um e-mail', () => {
    expect(NegocioSchema.safeParse({ ...negocio, email: 'contato@exemplo.com.br' }).success).toBe(
      true,
    )
    expect(NegocioSchema.safeParse({ ...negocio, email: 'contato' }).success).toBe(false)
  })

  it('a hora vai de 00:00 a 23:59', () => {
    const horario = (abre: string, fecha: string) =>
      HorarioSchema.safeParse({ dia: 1, abre, fecha }).success
    expect(horario('00:00', '23:59')).toBe(true)
    expect(horario('18:00', '02:00')).toBe(true)
    for (const errada of ['24:00', '99:99', '9:00', '12:60'])
      expect(horario(errada, '18:00'), errada).toBe(false)
  })

  it('abrir e fechar na mesma hora não vale (deixaria o negócio aberto o dia todo)', () => {
    expect(HorarioSchema.safeParse({ dia: 1, abre: '09:00', fecha: '09:00' }).success).toBe(false)
  })

  it('a foto mora no próprio site, em /fotos, ou não existe', () => {
    const produto = { id: 'x', nome: 'X', descricao: '', precoCentavos: 100, disponivel: true }
    const aceita = (foto: string | null) => ProdutoSchema.safeParse({ ...produto, foto }).success
    expect(aceita(null)).toBe(true)
    expect(aceita('/fotos/produto-1.webp')).toBe(true)
    expect(aceita('/fotos/2026/11/bolo.jpg')).toBe(true)
    for (const errada of [
      'https://outro.site/x.jpg',
      '/fotos/../.env',
      '/fotos/.escondida',
      '/outra/x.webp',
      '/fotos/',
    ]) {
      expect(aceita(errada), errada).toBe(false)
    }
  })
})
