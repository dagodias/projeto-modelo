/**
 * A casca do site num navegador de verdade: as páginas de base, o contato e o rodapé, o menu do celular, o
 * teclado, a página de erro, o guia de estilo, o modo escuro e os arquivos da prévia do link.
 */
import { type NegocioPublico, NegocioPublicoSchema } from '@projeto/shared'
import { expect, type Locator, test } from '@playwright/test'

const paginas = [
  { caminho: '/sobre', titulo: 'A nossa história', aba: 'Sobre' },
  { caminho: '/contato', titulo: 'Fale com a gente', aba: 'Contato' },
  { caminho: '/privacidade', titulo: 'Os seus dados', aba: 'Privacidade' },
]

test('cada página abre com o seu título e cabe na tela', async ({ page, request }) => {
  const negocio = NegocioPublicoSchema.parse(await (await request.get('/api/negocio')).json())

  for (const pagina of paginas) {
    await page.goto(pagina.caminho)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(pagina.titulo)
    await expect(page).toHaveTitle(`${pagina.aba} · ${negocio.nome}`)
    const sobra = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(sobra, pagina.caminho).toBe(0)
  }
})

/** O telefone sempre; o WhatsApp só se o número atende nele; o e-mail só se o negócio tem. */
async function conferirContatos(lugar: Locator, negocio: NegocioPublico) {
  await expect(lugar.getByRole('link', { name: /^Telefone/ })).toHaveAttribute(
    'href',
    `tel:+${negocio.telefone}`,
  )
  const whatsapp = lugar.getByRole('link', { name: /^WhatsApp/ })
  if (negocio.temWhatsapp) {
    await expect(whatsapp).toHaveAttribute(
      'href',
      new RegExp(`^https://wa\\.me/${negocio.telefone}\\?text=`),
    )
  } else {
    await expect(whatsapp).toHaveCount(0)
  }
  const email = lugar.getByRole('link', { name: /^E-mail/ })
  if (negocio.email) {
    await expect(email).toHaveAttribute('href', `mailto:${negocio.email}`)
  } else {
    await expect(email).toHaveCount(0)
  }
}

test('o contato mostra os jeitos de falar com o negócio', async ({ page, request }) => {
  const negocio = NegocioPublicoSchema.parse(await (await request.get('/api/negocio')).json())
  await page.goto('/contato')
  await conferirContatos(page.getByRole('main'), negocio)
})

test('o rodapé traz os contatos e o caminho da privacidade', async ({ page, request }) => {
  const negocio = NegocioPublicoSchema.parse(await (await request.get('/api/negocio')).json())
  await page.goto('/')
  const rodape = page.getByRole('contentinfo')
  await conferirContatos(rodape, negocio)
  await rodape.getByRole('link', { name: 'Privacidade' }).click()
  await expect(page).toHaveURL(/\/privacidade$/)
})

test('o menu do celular abre, leva à página e fecha', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'o menu de botão é só do celular')
  await page.goto('/')
  const botao = page.locator('button[aria-controls="menu-celular"]')
  const menu = page.locator('#menu-celular')

  // O botão só responde depois que o Vue assume a página (a hidratação): tenta até o menu abrir.
  await expect(async () => {
    if (!(await menu.isVisible())) await botao.click()
    await expect(menu).toBeVisible({ timeout: 1000 })
  }).toPass()

  await menu.getByRole('link', { name: 'Contato' }).click()
  await expect(page).toHaveURL(/\/contato$/)
  await expect(menu).toBeHidden()
  await expect(botao).toHaveAttribute('aria-expanded', 'false')
})

test('o primeiro Tab mostra o link de pular para o conteúdo', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const pular = page.getByRole('link', { name: 'Pular para o conteúdo' })
  await expect(pular).toBeFocused()
  await expect(pular).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page.locator('main#conteudo')).toBeFocused()
})

test('a página que não existe responde 404 e deixa voltar', async ({ page }) => {
  const resposta = await page.goto('/pagina-que-nao-existe')
  expect(resposta?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Esta página não existe')

  // O botão também espera a hidratação: tenta até chegar ao início.
  await expect(async () => {
    await page.getByRole('button', { name: 'Voltar ao início' }).click({ timeout: 2000 })
    await expect(page).toHaveURL(/\/$/, { timeout: 2000 })
  }).toPass()
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Esta página não existe')
})

test('o guia de estilo fica fora do Google e fora do menu', async ({ page }) => {
  await page.goto('/guia-de-estilo')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Guia de estilo')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  await expect(page.getByRole('banner').getByRole('link', { name: 'Guia de estilo' })).toHaveCount(
    0,
  )
})

test('as páginas saem com os cabeçalhos de segurança', async ({ request }) => {
  const cabecalhos = (await request.get('/')).headers()
  expect(cabecalhos['x-content-type-options']).toBe('nosniff')
  expect(cabecalhos['x-frame-options']).toBe('DENY')
  expect(cabecalhos['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(cabecalhos['permissions-policy']).toContain('camera=()')
  // Os testes de tela rodam o build de produção: o HSTS vai junto (no pnpm dev, não).
  expect(cabecalhos['strict-transport-security']).toContain('max-age=')
})

test('as páginas do dono e do pedido não ficam guardadas, nem passam o endereço, nem vão ao Google', async ({
  request,
}) => {
  // Elas nascem nas aulas; os cabeçalhos já valem para o caminho, antes de a página existir (até no 404).
  for (const caminho of ['/painel', '/painel/pedidos', '/entrar', '/pedido/abc123']) {
    const cabecalhos = (await request.get(caminho, { headers: { accept: 'text/html' } })).headers()
    expect(cabecalhos['cache-control'], caminho).toBe('no-store')
    expect(cabecalhos['referrer-policy'], caminho).toBe('no-referrer')
    expect(cabecalhos['x-robots-tag'], caminho).toContain('noindex')
    expect(cabecalhos['x-content-type-options'], caminho).toBe('nosniff')
  }
})

test('a prévia do link e os ícones estão no lugar', async ({ page, request }) => {
  await page.goto('/')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /previa\.png$/)
  for (const arquivo of [
    '/previa.png',
    '/logo.svg',
    '/icone.svg',
    '/favicon.ico',
    '/apple-touch-icon.png',
  ]) {
    expect((await request.get(arquivo)).status(), arquivo).toBe(200)
  }
})

test.describe('com o modo escuro ligado no aparelho', () => {
  test.use({ colorScheme: 'dark' })

  test('o site fica escuro sozinho', async ({ page }) => {
    await page.goto('/')
    const fundo = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    expect(fundo).not.toBe('rgb(255, 255, 255)')
  })
})
