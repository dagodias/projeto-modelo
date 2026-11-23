<script setup lang="ts">
import { formatarPreco } from '@projeto/shared'
import { MessageCircle } from '@lucide/vue'

const { $api } = useNuxtApp()
const { data: negocio, error } = await useAsyncData('negocio', async () => {
  // O caminho e o formato da resposta vêm do contrato: o editor completa e o typecheck confere.
  const { data } = await $api.GET('/api/negocio')
  if (!data) throw createError({ statusCode: 502, statusMessage: 'A API não respondeu' })
  return data
})

useSeoMeta({
  title: () => negocio.value?.nome ?? 'Carregando',
  description: () => negocio.value?.frase ?? '',
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-12">
    <p
      v-if="error"
      class="rounded-xl bg-red-100 p-4 text-red-900 dark:bg-red-950 dark:text-red-100"
    >
      A API não respondeu. Confira se ela está ligada (pnpm dev).
    </p>

    <template v-else-if="negocio">
      <header class="space-y-4">
        <h1 class="text-4xl font-bold tracking-tight">{{ negocio.nome }}</h1>
        <p class="text-lg text-stone-600 dark:text-stone-300">{{ negocio.frase }}</p>
        <p
          class="text-sm font-semibold"
          :class="negocio.abertoAgora ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500'"
        >
          {{ negocio.abertoAgora ? 'Aberto agora' : 'Fechado agora' }}
        </p>
        <a
          :href="linkWhatsapp(negocio.whatsapp, `Olá! Vim pelo site de ${negocio.nome}.`)"
          class="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          <MessageCircle class="size-5" aria-hidden="true" />
          Falar pelo WhatsApp
        </a>
      </header>

      <section class="mt-10 grid gap-4 sm:grid-cols-2" aria-label="Produtos">
        <article
          v-for="produto in negocio.produtos"
          :key="produto.id"
          class="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
        >
          <h2 class="font-semibold">{{ produto.nome }}</h2>
          <p class="mt-1 text-sm text-stone-600 dark:text-stone-300">{{ produto.descricao }}</p>
          <p class="mt-3 text-lg font-bold">{{ formatarPreco(produto.precoCentavos) }}</p>
        </article>
      </section>
    </template>
  </div>
</template>
