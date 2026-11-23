<script setup lang="ts">
/**
 * O selo: uma etiqueta curta (Aberto agora, Novo, Exemplo).
 * tipo: neutro, marca (a cor da marca), sucesso (verde, sempre) ou exemplo (o que é para trocar).
 * ponto: a bolinha antes do texto.
 */
const props = withDefaults(
  defineProps<{ tipo?: 'neutro' | 'marca' | 'sucesso' | 'exemplo'; ponto?: boolean }>(),
  { tipo: 'neutro', ponto: false },
)

const cores = {
  neutro: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
  marca:
    'bg-marca-50 text-marca-800 ring-1 ring-marca-200 ring-inset dark:bg-marca-950 dark:text-marca-300 dark:ring-marca-800',
  sucesso:
    'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 ring-inset dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900',
  exemplo:
    'border border-dashed border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950/60 dark:text-amber-300',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
    :class="cores[props.tipo]"
  >
    <span v-if="ponto" class="size-1.5 rounded-full bg-current" aria-hidden="true" />
    <slot />
  </span>
</template>
