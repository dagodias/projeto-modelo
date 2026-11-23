<script setup lang="ts">
/**
 * A página inicial de exemplo: o topo com os dados que vêm da API e seções marcadas para trocar.
 * O PROMPT-PAGINA-PRINCIPAL do curso transforma a página antiga do negócio (docs/original) nesta página.
 */
import { formatarPreco } from '@projeto/shared'
import { ArrowDown, ArrowRight, ImageIcon, Package, Phone, ShoppingBag } from '@lucide/vue'

const { data: negocio, error } = await useNegocio()

useSeoMeta({
  title: () => negocio.value?.nome ?? 'Início',
  ogTitle: () => negocio.value?.nome,
  description: () => negocio.value?.frase,
  ogDescription: () => negocio.value?.frase,
})

// Exemplo: troque pelos passos do seu negócio, ou apague a seção.
const passos = [
  {
    icone: ShoppingBag,
    titulo: 'Escolha',
    texto: 'Veja os produtos e os preços com calma, no celular ou no computador.',
  },
  {
    icone: Phone,
    titulo: 'Fale com a gente',
    texto: 'Tire as dúvidas e combine os detalhes do jeito que preferir.',
  },
  {
    icone: Package,
    titulo: 'Receba ou retire',
    texto: 'Combine a entrega ou passe aqui para buscar.',
  },
]
</script>

<template>
  <div>
    <BaseSecao v-if="error">
      <BaseAviso tipo="erro" titulo="A API não respondeu">
        Confira se ela está ligada (pnpm dev) e recarregue a página.
      </BaseAviso>
    </BaseSecao>

    <template v-else-if="negocio">
      <section class="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          class="absolute inset-x-0 -top-48 -z-10 h-[36rem] bg-[radial-gradient(ellipse_at_top,var(--color-marca-100),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--color-marca-900)_45%,transparent),transparent_65%)]"
        />
        <div
          class="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:grid-cols-2 lg:gap-16 lg:pt-24 lg:pb-28"
        >
          <div>
            <BaseSelo :tipo="negocio.abertoAgora ? 'sucesso' : 'neutro'" ponto>
              {{ negocio.abertoAgora ? 'Aberto agora' : 'Fechado agora' }}
            </BaseSelo>
            <h1
              class="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              {{ negocio.nome }}
            </h1>
            <p
              class="mt-5 max-w-xl text-lg text-pretty text-stone-600 sm:text-xl dark:text-stone-400"
            >
              {{ negocio.frase }}
            </p>
            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <BaseBotao para="#produtos" tamanho="grande">
                Ver os produtos
                <ArrowDown class="size-5" aria-hidden="true" />
              </BaseBotao>
              <BaseBotao para="/contato" variante="secundario" tamanho="grande">
                Fale com a gente
              </BaseBotao>
            </div>
          </div>
          <img
            src="/exemplo/foto.svg"
            alt="Exemplo: troque pela foto do seu negócio"
            width="1200"
            height="900"
            class="aspect-[4/3] w-full rounded-3xl border border-stone-200 object-cover shadow-sm dark:border-stone-800"
          />
        </div>
      </section>

      <BaseSecao
        id="produtos"
        titulo="Os produtos"
        subtitulo="O que temos hoje, com o preço de cada um."
        fundo="suave"
        exemplo
      >
        <ul v-if="negocio.produtos.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="produto in negocio.produtos" :key="produto.id">
            <BaseCartao tag="article" :respiro="false" class="flex h-full flex-col overflow-hidden">
              <img
                v-if="produto.foto"
                :src="produto.foto"
                :alt="produto.nome"
                width="600"
                height="400"
                loading="lazy"
                class="aspect-[3/2] w-full object-cover"
              />
              <div
                v-else
                class="grid aspect-[3/2] place-items-center bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500"
              >
                <ImageIcon class="size-8" aria-hidden="true" />
              </div>
              <div class="flex flex-1 flex-col p-5">
                <div class="flex items-start justify-between gap-4">
                  <h3 class="font-semibold">{{ produto.nome }}</h3>
                  <p class="shrink-0 font-semibold text-marca-700 dark:text-marca-400">
                    {{ formatarPreco(produto.precoCentavos) }}
                  </p>
                </div>
                <p class="mt-1.5 text-sm text-stone-600 dark:text-stone-400">
                  {{ produto.descricao }}
                </p>
              </div>
            </BaseCartao>
          </li>
        </ul>
        <BaseVazio
          v-else
          titulo="Nenhum produto ainda"
          texto="Os produtos aparecem aqui assim que entrarem no apps/api/src/config/negocio.ts."
        />
      </BaseSecao>

      <BaseSecao
        titulo="Como funciona"
        subtitulo="Três passos, do jeito que o seu cliente já usa."
        exemplo
      >
        <ol class="grid gap-5 sm:grid-cols-3">
          <li v-for="(passo, i) in passos" :key="passo.titulo">
            <BaseCartao class="h-full">
              <div class="flex items-center gap-3">
                <span
                  class="grid size-10 place-items-center rounded-full bg-marca-50 text-marca-700 dark:bg-marca-950 dark:text-marca-300"
                >
                  <component :is="passo.icone" class="size-5" aria-hidden="true" />
                </span>
                <span class="text-sm font-semibold text-stone-500 dark:text-stone-400"
                  >Passo {{ i + 1 }}</span
                >
              </div>
              <h3 class="mt-4 text-lg font-semibold">{{ passo.titulo }}</h3>
              <p class="mt-1.5 text-stone-600 dark:text-stone-400">{{ passo.texto }}</p>
            </BaseCartao>
          </li>
        </ol>
      </BaseSecao>

      <section class="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div
          class="flex flex-col items-start gap-6 rounded-3xl bg-marca-700 px-6 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10 dark:bg-marca-900"
        >
          <div>
            <h2 class="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Ficou com alguma dúvida?
            </h2>
            <p class="mt-2 text-marca-50">
              O telefone, o endereço e o horário estão na página de contato.
            </p>
          </div>
          <BaseBotao para="/contato" variante="secundario" tamanho="grande" class="shrink-0">
            Fale com a gente
            <ArrowRight class="size-5" aria-hidden="true" />
          </BaseBotao>
        </div>
      </section>
    </template>
  </div>
</template>
