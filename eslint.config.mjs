import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default defineConfig(
  {
    ignores: [
      '**/node_modules/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/dist/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      // gerado pelo pnpm contrato: nunca se edita à mão
      'apps/web/app/types/api.d.ts',
      // a página antiga do negócio e o modelo de estilo baixado: referência, não código do projeto
      'docs/original/**',
      'docs/estilo/**',
    ],
  },
  tseslint.configs.recommended,
  pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
  },
  {
    rules: {
      // páginas do Nuxt se chamam index.vue, catalogo.vue
      'vue/multi-word-component-names': 'off',
    },
  },
  prettier,
)
