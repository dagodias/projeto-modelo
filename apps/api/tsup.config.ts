import { defineConfig } from 'tsup'

// O build da API leva o pacote shared junto, já que ele é TypeScript puro.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node24',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  noExternal: ['@projeto/shared'],
})
