/** A página principal num navegador de verdade: o que a pessoa vê vem da API. */
import { NegocioPublicoSchema } from '@projeto/shared'
import { expect, test } from '@playwright/test'

test('mostra o negócio e os produtos que vêm da API', async ({ page, request }) => {
  // O mesmo contrato da frente e da API confere a resposta.
  const resposta = await request.get('/api/negocio')
  const negocio = NegocioPublicoSchema.parse(await resposta.json())

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(negocio.nome)
  await expect(page.getByText(negocio.abertoAgora ? 'Aberto agora' : 'Fechado agora')).toBeVisible()
  // Um cartão por produto disponível: o que está em falta a API nem manda.
  await expect(page.locator('#produtos').getByRole('article')).toHaveCount(negocio.produtos.length)

  const principal = page.getByRole('main')
  await expect(principal.getByRole('link', { name: 'Ver os produtos' })).toHaveAttribute(
    'href',
    '#produtos',
  )
  // "Fale com a gente" aparece no começo e no fim da página: os dois levam ao contato.
  const contato = principal.getByRole('link', { name: 'Fale com a gente' })
  await expect(contato).toHaveCount(2)
  for (const link of await contato.all()) await expect(link).toHaveAttribute('href', '/contato')
})

test('cabe na tela, sem rolar para o lado', async ({ page }) => {
  await page.goto('/')
  const sobra = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(sobra).toBe(0)
})

test.describe('sem JavaScript, como o robô do Google e a prévia do link compartilhado', () => {
  test.use({ javaScriptEnabled: false })

  test('a página chega pronta do servidor', async ({ page, request }) => {
    const negocio = NegocioPublicoSchema.parse(await (await request.get('/api/negocio')).json())

    await page.goto('/')
    await expect(page).toHaveTitle(negocio.nome)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(negocio.nome)
  })
})
