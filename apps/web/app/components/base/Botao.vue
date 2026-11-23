<script setup lang="ts">
/**
 * O botão do site. Com "para", vira link (uma página do site ou um endereço de fora, como o do mapa);
 * sem "para", é um botão de verdade.
 * variante: principal (a ação mais importante da tela; uma por tela), secundario ou discreto.
 */
const props = withDefaults(
  defineProps<{
    para?: string
    variante?: 'principal' | 'secundario' | 'discreto'
    tamanho?: 'pequeno' | 'normal' | 'grande'
    /** Ocupa a largura toda (bom no celular). */
    bloco?: boolean
    tipo?: 'button' | 'submit'
  }>(),
  { para: undefined, variante: 'principal', tamanho: 'normal', bloco: false, tipo: 'button' },
)

const variantes = {
  principal:
    'bg-marca-700 text-white shadow-sm hover:bg-marca-800 dark:bg-marca-500 dark:text-stone-950 dark:hover:bg-marca-400',
  secundario:
    'border border-stone-300 bg-white text-stone-900 shadow-sm hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800',
  discreto:
    'text-stone-700 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white',
}

const tamanhos = {
  pequeno: 'h-9 px-3.5 text-sm',
  normal: 'h-11 px-5 text-base',
  grande: 'h-12 px-6 text-base sm:text-lg',
}

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-botao font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50',
  variantes[props.variante],
  tamanhos[props.tamanho],
  props.bloco && 'w-full',
])
</script>

<template>
  <NuxtLink v-if="para" :to="para" :class="classes"><slot /></NuxtLink>
  <button v-else :type="tipo" :class="classes"><slot /></button>
</template>
