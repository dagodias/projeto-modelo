<script setup lang="ts">
/**
 * O estado vazio: o que aparece quando ainda não há nada para mostrar (nenhum produto, nenhum pedido).
 * Diga o que é e, se houver, o próximo passo, num botão dentro dele.
 */
import type { Component } from 'vue'
import { Inbox } from '@lucide/vue'

withDefaults(defineProps<{ titulo: string; texto?: string; icone?: Component }>(), {
  texto: undefined,
  icone: () => Inbox,
})
</script>

<template>
  <div
    class="flex flex-col items-center rounded-cartao border border-dashed border-stone-300 px-6 py-12 text-center dark:border-stone-700"
  >
    <div
      class="grid size-12 place-items-center rounded-full bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400"
    >
      <component :is="icone" class="size-6" aria-hidden="true" />
    </div>
    <h3 class="mt-4 font-semibold">{{ titulo }}</h3>
    <p v-if="texto" class="mt-1 max-w-sm text-sm text-pretty text-stone-600 dark:text-stone-400">
      {{ texto }}
    </p>
    <div v-if="$slots.default" class="mt-6"><slot /></div>
  </div>
</template>
