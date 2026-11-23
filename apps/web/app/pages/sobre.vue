<script setup lang="ts">
/** A página Sobre, de exemplo: a história e o que o negócio valoriza. Troque os textos pelos seus. */
import { HeartHandshake, MapPin, Sparkles } from '@lucide/vue'

useSeoMeta({
  title: 'Sobre',
  ogTitle: 'Sobre',
  description: 'A nossa história e o que importa para a gente.',
  ogDescription: 'A nossa história e o que importa para a gente.',
})

// Exemplo: troque pelo que o seu negócio valoriza.
const valores = [
  {
    icone: Sparkles,
    titulo: 'Qualidade',
    texto: 'O que sai daqui é o que a gente serviria em casa.',
  },
  {
    icone: HeartHandshake,
    titulo: 'Atendimento',
    texto: 'Do outro lado tem gente, que responde sem demora.',
  },
  {
    icone: MapPin,
    titulo: 'Perto de você',
    texto: 'Um negócio do bairro, que conhece quem atende.',
  },
]
</script>

<template>
  <div>
    <BaseCabecalho
      rotulo="Sobre"
      titulo="A nossa história"
      subtitulo="Conte em poucas linhas quem vocês são e por que fazem o que fazem."
      exemplo
    />

    <BaseSecao>
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="space-y-5 text-lg text-stone-700 dark:text-stone-300">
          <p>
            Comece pelo começo: quem abriu o negócio, em que ano e por quê. Uma história curta e
            verdadeira vale mais que muitas palavras bonitas.
          </p>
          <p>
            Depois, o que faz de vocês diferentes: o jeito de atender, o cuidado com o produto, a
            ligação com o bairro.
          </p>
          <p>
            Termine com o convite: o telefone, o endereço e o horário estão na página de contato.
          </p>
          <BaseBotao para="/contato" variante="secundario">Ver o contato</BaseBotao>
        </div>
        <img
          src="/exemplo/foto.svg"
          alt="Exemplo: troque por uma foto do negócio ou da equipe"
          width="1200"
          height="900"
          class="aspect-[4/3] w-full rounded-3xl border border-stone-200 object-cover dark:border-stone-800"
        />
      </div>
    </BaseSecao>

    <BaseSecao titulo="O que importa para a gente" fundo="suave" exemplo>
      <ul class="grid gap-5 sm:grid-cols-3">
        <li v-for="valor in valores" :key="valor.titulo">
          <BaseCartao class="h-full">
            <span
              class="grid size-10 place-items-center rounded-full bg-marca-50 text-marca-700 dark:bg-marca-950 dark:text-marca-300"
            >
              <component :is="valor.icone" class="size-5" aria-hidden="true" />
            </span>
            <h3 class="mt-4 text-lg font-semibold">{{ valor.titulo }}</h3>
            <p class="mt-1.5 text-stone-600 dark:text-stone-400">{{ valor.texto }}</p>
          </BaseCartao>
        </li>
      </ul>
    </BaseSecao>
  </div>
</template>
