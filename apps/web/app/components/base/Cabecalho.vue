<script setup lang="ts">
/**
 * O começo de uma página interna: o título (o h1 da página), o subtítulo e, se quiser, um rótulo em cima.
 * exemplo: mostra o selo "Exemplo" (texto de exemplo, para trocar pelo do negócio).
 */
withDefaults(
  defineProps<{ titulo: string; subtitulo?: string; rotulo?: string; exemplo?: boolean }>(),
  {
    subtitulo: undefined,
    rotulo: undefined,
    exemplo: false,
  },
)
</script>

<template>
  <div class="border-b border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/40">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <BaseSelo v-if="exemplo" tipo="exemplo" class="mb-4">Exemplo: troque pelo seu</BaseSelo>
      <p v-if="rotulo" class="text-sm font-semibold text-marca-700 dark:text-marca-400">
        {{ rotulo }}
      </p>
      <h1
        class="text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
        :class="rotulo && 'mt-2'"
      >
        {{ titulo }}
      </h1>
      <p
        v-if="subtitulo"
        class="mt-4 max-w-2xl text-lg text-pretty text-stone-600 dark:text-stone-400"
      >
        {{ subtitulo }}
      </p>
    </div>
  </div>
</template>
