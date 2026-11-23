<script setup lang="ts">
/**
 * O carregando: o lugar do conteúdo, piscando de leve, enquanto ele não chega.
 * linhas: quantas linhas de texto imitar. texto: o que o leitor de tela diz.
 */
withDefaults(defineProps<{ linhas?: number; texto?: string }>(), { linhas: 3, texto: 'Carregando' })
</script>

<template>
  <div role="status" class="space-y-3">
    <span class="sr-only">{{ texto }}</span>
    <div
      v-for="linha in linhas"
      :key="linha"
      class="h-4 rounded-full bg-stone-200 motion-safe:animate-pulse dark:bg-stone-800"
      :class="linha === linhas && linhas > 1 ? 'w-2/3' : 'w-full'"
      aria-hidden="true"
    />
  </div>
</template>
