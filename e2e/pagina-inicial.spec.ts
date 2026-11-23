/** A página principal num navegador de verdade: o que a pessoa vê vem da API. */
import { NegocioPublicoSchema } from '@projeto/shared'
import { expect, test } from '@playwright/test'

test('mostra o negócio que vem da API, com o link do WhatsApp', async ({ page, request }) => {
  // O mesmo contrato da frente e da API confere a resposta.
  const resposta = await request.get('/api/negocio')
  const negocio = NegocioPublicoSchema.parse(await resposta.json())

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(negocio.nome)
  await expect(page.getByText(negocio.abertoAgora ? 'Aberto agora' : 'Fechado agora')).toBeVisible()
  // O botão do WhatsApp aparece no topo, na página e no fim dela: confere o primeiro da página.
  await expect(
    page.getByRole('main').getByRole('link', { name: 'Falar pelo WhatsApp' }).first(),
  ).toHaveAttribute('href', new RegExp(`^https://wa\\.me/${negocio.whatsapp}\\?text=`))
})

test('cabe na tela, sem rolar para o lado', async ({ page }) => {
  await page.goto('/')
  const sobra = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(sobra).toBe(0)
})

test.describe('sem JavaScript, como o robô do Google e a prévia do link no WhatsApp', () => {
  test.use({ javaScriptEnabled: false })

  test('a página chega pronta do servidor', async ({ page, request }) => {
    const negocio = NegocioPublicoSchema.parse(await (await request.get('/api/negocio')).json())

    await page.goto('/')
    await expect(page).toHaveTitle(negocio.nome)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(negocio.nome)
  })
})
