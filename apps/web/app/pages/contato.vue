<script setup lang="ts">
/**
 * O contato: o telefone, o WhatsApp (só se o número atende nele), o e-mail (só se o negócio tem), o endereço com o
 * mapa e o horário, tudo vindo da API. Sem formulário.
 */
import { Clock, Mail, MapPin, MessageCircle, Phone } from '@lucide/vue'

const { data: negocio, error } = await useNegocio()

useSeoMeta({
  title: 'Contato',
  ogTitle: 'Contato',
  description: 'Os contatos, o endereço e o horário.',
  ogDescription: 'Os contatos, o endereço e o horário.',
})

const canais = computed(() => (negocio.value ? canaisDeContato(negocio.value) : []))
const horarios = computed(() => (negocio.value ? resumirHorarios(negocio.value.horarios) : []))

const icones = { telefone: Phone, whatsapp: MessageCircle, email: Mail }
const icone =
  'grid size-10 place-items-center rounded-full bg-marca-50 text-marca-700 dark:bg-marca-950 dark:text-marca-300'
</script>

<template>
  <div>
    <BaseCabecalho
      rotulo="Contato"
      titulo="Fale com a gente"
      subtitulo="Os contatos, o endereço e o horário, num lugar só."
    />

    <BaseSecao>
      <BaseAviso v-if="error" tipo="erro" titulo="A API não respondeu">
        Confira se ela está ligada (pnpm dev) e recarregue a página.
      </BaseAviso>

      <div v-else-if="negocio" class="grid gap-5 md:grid-cols-2">
        <!-- O atendimento ocupa a largura toda: o e-mail comprido cabe sem quebrar no meio. -->
        <BaseCartao class="md:col-span-2">
          <span :class="icone"><Phone class="size-5" aria-hidden="true" /></span>
          <h2 class="mt-4 text-lg font-semibold">Atendimento</h2>
          <ul class="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            <li v-for="canal in canais" :key="canal.tipo">
              <a
                :href="canal.link"
                class="flex h-full items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 transition-colors hover:border-marca-300 hover:bg-marca-50 dark:border-stone-800 dark:hover:border-marca-800 dark:hover:bg-marca-950/40"
              >
                <component
                  :is="icones[canal.tipo]"
                  class="size-5 shrink-0 text-marca-700 dark:text-marca-400"
                  aria-hidden="true"
                />
                <span class="min-w-0">
                  <span class="block text-sm text-stone-500 dark:text-stone-400">
                    {{ canal.rotulo }}
                  </span>
                  <span class="block font-medium wrap-anywhere">
                    <template v-for="(pedaco, i) in canal.pedacos" :key="i"
                      ><wbr v-if="i > 0" />{{ pedaco }}</template
                    >
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </BaseCartao>

        <BaseCartao class="flex flex-col">
          <span :class="icone"><MapPin class="size-5" aria-hidden="true" /></span>
          <h2 class="mt-4 text-lg font-semibold">Endereço</h2>
          <p class="mt-1 text-stone-600 dark:text-stone-400">{{ negocio.endereco }}</p>
          <BaseBotao
            :para="linkMapa(negocio.endereco)"
            variante="secundario"
            class="mt-6 self-start"
          >
            Abrir no mapa
          </BaseBotao>
        </BaseCartao>

        <BaseCartao>
          <div class="flex items-center justify-between gap-3">
            <span :class="icone"><Clock class="size-5" aria-hidden="true" /></span>
            <BaseSelo :tipo="negocio.abertoAgora ? 'sucesso' : 'neutro'" ponto>
              {{ negocio.abertoAgora ? 'Aberto agora' : 'Fechado agora' }}
            </BaseSelo>
          </div>
          <h2 class="mt-4 text-lg font-semibold">Horário</h2>
          <dl class="mt-2 space-y-2 text-sm">
            <div v-for="linha in horarios" :key="linha.dias" class="flex justify-between gap-4">
              <dt class="text-stone-600 dark:text-stone-400">{{ linha.dias }}</dt>
              <dd class="font-medium">{{ linha.horas }}</dd>
            </div>
          </dl>
        </BaseCartao>
      </div>

      <p class="mt-10 max-w-2xl text-sm text-stone-500 dark:text-stone-400">
        Como cuidamos dos seus dados:
        <NuxtLink to="/privacidade" class="font-medium underline underline-offset-4"
          >veja a privacidade</NuxtLink
        >.
      </p>
    </BaseSecao>
  </div>
</template>
