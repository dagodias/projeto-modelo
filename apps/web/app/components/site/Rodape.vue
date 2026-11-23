<script setup lang="ts">
/** O rodapé de todas as páginas: a logo, a frase, o contato, as redes e os links. Os dados vêm da API. */
import type { NegocioPublico } from '@projeto/shared'
import { Mail, MapPin, MessageCircle, Phone } from '@lucide/vue'

const props = defineProps<{ negocio?: NegocioPublico | null }>()

const { menu } = useAppConfig()
// O ano sai do servidor, para a página montada lá e a do navegador não discordarem na virada do ano.
const ano = useState('ano', () => new Date().getFullYear())

// O telefone sempre; o WhatsApp e o e-mail só se o negócio tiver (utils/contato.ts).
const canais = computed(() => (props.negocio ? canaisDeContato(props.negocio) : []))
const icones = { telefone: Phone, whatsapp: MessageCircle, email: Mail }

const link =
  'text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
</script>

<template>
  <footer class="border-t border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/40">
    <!-- No tablet, a logo em cima e as duas colunas embaixo: em 12 colunas, o contato ficava estreito. -->
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-12">
      <div class="md:col-span-2 lg:col-span-5">
        <SiteLogo :nome="negocio?.nome" />
        <p v-if="negocio" class="mt-4 max-w-sm text-sm text-stone-600 dark:text-stone-400">
          {{ negocio.frase }}
        </p>
      </div>

      <div v-if="negocio" class="lg:col-span-4">
        <h2 class="text-sm font-semibold">Contato</h2>
        <ul class="mt-3 space-y-3 text-sm">
          <li v-for="canal in canais" :key="canal.tipo">
            <a :href="canal.link" class="inline-flex items-center gap-2" :class="link">
              <component :is="icones[canal.tipo]" class="size-4 shrink-0" aria-hidden="true" />
              <span class="wrap-anywhere"
                >{{ canal.rotulo }}
                <template v-for="(pedaco, i) in canal.pedacos" :key="i"
                  ><wbr v-if="i > 0" />{{ pedaco }}</template
                ></span
              >
            </a>
          </li>
          <li>
            <a :href="linkMapa(negocio.endereco)" class="inline-flex gap-2" :class="link">
              <MapPin class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{{ negocio.endereco }}</span>
            </a>
          </li>
        </ul>
        <ul v-if="negocio.redes.length" class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <li v-for="rede in negocio.redes" :key="rede.endereco">
            <a
              :href="rede.endereco"
              class="font-medium underline-offset-4 hover:underline"
              :class="link"
            >
              {{ rede.nome }}
            </a>
          </li>
        </ul>
      </div>

      <nav aria-label="Rodapé" class="lg:col-span-3">
        <h2 class="text-sm font-semibold">Páginas</h2>
        <ul class="mt-3 space-y-2 text-sm">
          <li v-for="item in menu" :key="item.para">
            <NuxtLink :to="item.para" :class="link">{{ item.rotulo }}</NuxtLink>
          </li>
          <li><NuxtLink to="/privacidade" :class="link">Privacidade</NuxtLink></li>
        </ul>
      </nav>
    </div>

    <div class="border-t border-stone-200 dark:border-stone-800">
      <div
        class="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-stone-500 sm:flex-row sm:justify-between sm:px-6 dark:text-stone-400"
      >
        <p>© {{ ano }} {{ negocio?.nome }}</p>
        <p>Este site não usa rastreadores.</p>
      </div>
    </div>
  </footer>
</template>
