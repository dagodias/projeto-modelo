/**
 * Os testes de tela: um navegador de verdade abre o site, no tamanho de um celular e de um computador.
 * pnpm e2e faz o build, liga a API e a frente e roda os testes da pasta e2e/.
 * Na primeira vez, baixe o navegador: pnpm exec playwright install chromium
 */
import { defineConfig, devices } from '@playwright/test'

const noGitHub = Boolean(process.env.CI)

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: noGitHub,
  retries: noGitHub ? 1 : 0,
  reporter: noGitHub ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'celular', use: { ...devices['Pixel 7'] } },
    { name: 'computador', use: { ...devices['Desktop Chrome'] } },
  ],
  // Liga a API e a frente já construídas. No computador, se o pnpm dev estiver ligado, usa ele.
  webServer: [
    {
      command: 'pnpm --filter @projeto/api start',
      url: 'http://127.0.0.1:3333/api/saude',
      reuseExistingServer: !noGitHub,
    },
    {
      command: 'pnpm --filter @projeto/web preview',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: !noGitHub,
    },
  ],
})
