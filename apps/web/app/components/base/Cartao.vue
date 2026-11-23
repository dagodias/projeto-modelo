<script setup lang="ts">
/**
 * O cartão: um bloco com borda e respiro, para agrupar um assunto (um produto, um contato, um passo).
 * tag: o elemento do HTML (article para um produto; li já vem da lista em volta). respiro: o espaço por dentro.
 */
withDefaults(defineProps<{ tag?: string; respiro?: boolean }>(), { tag: 'div', respiro: true })
</script>

<template>
  <component
    :is="tag"
    class="rounded-cartao border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
    :class="respiro && 'p-5 sm:p-6'"
  >
    <slot />
  </component>
</template>
