<script setup lang="ts">
/**
 * A seção: um pedaço da página com título (h2), subtítulo e o conteúdo, na largura do site.
 * fundo "suave" alterna a cor do fundo, para separar uma seção da outra.
 * exemplo: mostra o selo "Exemplo" (conteúdo de exemplo, para trocar pelo do negócio).
 */
withDefaults(
  defineProps<{
    titulo?: string
    subtitulo?: string
    rotulo?: string
    fundo?: 'nenhum' | 'suave'
    exemplo?: boolean
  }>(),
  { titulo: undefined, subtitulo: undefined, rotulo: undefined, fundo: 'nenhum', exemplo: false },
)

const idTitulo = useId()
</script>

<template>
  <section
    class="py-16 sm:py-20"
    :class="fundo === 'suave' && 'bg-stone-50 dark:bg-stone-900/40'"
    :aria-labelledby="titulo ? idTitulo : undefined"
  >
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <header v-if="titulo" class="mb-10 max-w-2xl">
        <BaseSelo v-if="exemplo" tipo="exemplo" class="mb-4">Exemplo: troque pelo seu</BaseSelo>
        <p v-if="rotulo" class="text-sm font-semibold text-marca-700 dark:text-marca-400">
          {{ rotulo }}
        </p>
        <h2
          :id="idTitulo"
          class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          :class="rotulo && 'mt-2'"
        >
          {{ titulo }}
        </h2>
        <p v-if="subtitulo" class="mt-3 text-lg text-pretty text-stone-600 dark:text-stone-400">
          {{ subtitulo }}
        </p>
      </header>
      <slot />
    </div>
  </section>
</template>
