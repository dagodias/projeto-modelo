<script setup lang="ts">
/**
 * O guia de estilo: todas as peças do site numa página só, para você e a IA verem antes de usar.
 * Fica fora do menu e fora do Google (noindex). Peça nova em components/base aparece aqui também.
 */
import { MessageCircle, PackageOpen } from '@lucide/vue'

useSeoMeta({
  title: 'Guia de estilo',
  description: 'As peças do site: cores, letras, botões, cartões, selos, avisos e estados.',
  robots: 'noindex, nofollow',
})

// As classes inteiras, para o Tailwind achar no código.
const marca = [
  ['50', 'bg-marca-50'],
  ['100', 'bg-marca-100'],
  ['200', 'bg-marca-200'],
  ['300', 'bg-marca-300'],
  ['400', 'bg-marca-400'],
  ['500', 'bg-marca-500'],
  ['600', 'bg-marca-600'],
  ['700', 'bg-marca-700'],
  ['800', 'bg-marca-800'],
  ['900', 'bg-marca-900'],
  ['950', 'bg-marca-950'],
]
const neutros = [
  ['50', 'bg-stone-50'],
  ['100', 'bg-stone-100'],
  ['200', 'bg-stone-200'],
  ['300', 'bg-stone-300'],
  ['400', 'bg-stone-400'],
  ['500', 'bg-stone-500'],
  ['600', 'bg-stone-600'],
  ['700', 'bg-stone-700'],
  ['800', 'bg-stone-800'],
  ['900', 'bg-stone-900'],
  ['950', 'bg-stone-950'],
]

const titulo = 'text-sm font-semibold text-stone-500 dark:text-stone-400'
</script>

<template>
  <div>
    <BaseCabecalho
      rotulo="Para quem constrói o site"
      titulo="Guia de estilo"
      subtitulo="Todas as peças do site numa página só. Use estas, nesta ordem de preferência, antes de criar outra."
    />

    <BaseSecao
      titulo="Cores"
      subtitulo="A cor da marca muda no assets/css/main.css; os neutros são o stone do Tailwind."
    >
      <div class="space-y-6">
        <div v-for="(paleta, nome) in { marca, neutros }" :key="nome">
          <p :class="titulo">
            {{ nome === 'marca' ? 'A marca (marca-*)' : 'Os neutros (stone-*)' }}
          </p>
          <ul class="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-11">
            <li v-for="[tom, classe] in paleta" :key="tom">
              <div
                class="h-12 rounded-lg ring-1 ring-stone-900/10 ring-inset dark:ring-white/10"
                :class="classe"
              />
              <p class="mt-1 text-xs text-stone-500 dark:text-stone-400">{{ tom }}</p>
            </li>
          </ul>
        </div>
      </div>
    </BaseSecao>

    <BaseSecao titulo="Letras" subtitulo="A Inter, servida pelo próprio site." fundo="suave">
      <div class="space-y-4">
        <p class="text-5xl font-semibold tracking-tight">Título da página (h1)</p>
        <p class="text-3xl font-semibold tracking-tight">Título da seção (h2)</p>
        <p class="text-lg font-semibold">Título do cartão (h3)</p>
        <p class="max-w-2xl text-lg text-stone-600 dark:text-stone-400">
          O subtítulo: uma ou duas frases que explicam a seção, em cinza.
        </p>
        <p class="max-w-2xl">
          O texto comum, para ler com calma, com no máximo uns 70 caracteres por linha.
        </p>
        <p class="text-sm text-stone-500 dark:text-stone-400">
          O texto pequeno, para detalhes e avisos.
        </p>
      </div>
    </BaseSecao>

    <BaseSecao titulo="Botões" subtitulo="Um principal por tela; o resto, secundário ou discreto.">
      <div class="space-y-6">
        <div class="flex flex-wrap items-center gap-3">
          <BaseBotao>Principal</BaseBotao>
          <BaseBotao variante="secundario">Secundário</BaseBotao>
          <BaseBotao variante="discreto">Discreto</BaseBotao>
          <BaseBotao disabled>Desligado</BaseBotao>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <BaseBotao tamanho="pequeno">Pequeno</BaseBotao>
          <BaseBotao>Normal</BaseBotao>
          <BaseBotao tamanho="grande">
            <MessageCircle class="size-5" aria-hidden="true" />
            Grande, com ícone
          </BaseBotao>
        </div>
      </div>
    </BaseSecao>

    <BaseSecao titulo="Selos e avisos" fundo="suave">
      <div class="space-y-8">
        <div class="flex flex-wrap gap-2">
          <BaseSelo>Neutro</BaseSelo>
          <BaseSelo tipo="marca">Da marca</BaseSelo>
          <BaseSelo tipo="sucesso" ponto>Aberto agora</BaseSelo>
          <BaseSelo tipo="exemplo">Exemplo: troque pelo seu</BaseSelo>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <BaseAviso titulo="Informação">Um aviso comum, para quem está na página.</BaseAviso>
          <BaseAviso tipo="sucesso" titulo="Deu certo">O que a pessoa fez funcionou.</BaseAviso>
          <BaseAviso tipo="atencao" titulo="Atenção">Algo pede cuidado antes de seguir.</BaseAviso>
          <BaseAviso tipo="erro" titulo="Não deu certo"
            >O que falhou e o que fazer agora.</BaseAviso
          >
        </div>
      </div>
    </BaseSecao>

    <BaseSecao titulo="Cartão, vazio e carregando">
      <div class="grid gap-5 md:grid-cols-3">
        <BaseCartao>
          <p :class="titulo">Cartão</p>
          <h3 class="mt-3 text-lg font-semibold">Um assunto por cartão</h3>
          <p class="mt-1.5 text-stone-600 dark:text-stone-400">Um produto, um contato, um passo.</p>
        </BaseCartao>
        <BaseVazio
          :icone="PackageOpen"
          titulo="Nada por aqui ainda"
          texto="Diga o que é e qual o próximo passo."
        >
          <BaseBotao variante="secundario" tamanho="pequeno">O próximo passo</BaseBotao>
        </BaseVazio>
        <BaseCartao>
          <p :class="titulo">Carregando</p>
          <BaseCarregando class="mt-4" :linhas="4" />
        </BaseCartao>
      </div>
    </BaseSecao>
  </div>
</template>
