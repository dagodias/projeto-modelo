import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  // A API roda na porta 3333 da mesma máquina, no computador e no servidor.
  // O Nuxt repassa /api para ela: o navegador vê um endereço só (o mesmo papel do nginx no servidor).
  routeRules: {
    '/api/**': { proxy: 'http://127.0.0.1:3333/api/**' },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
    },
  },
})
