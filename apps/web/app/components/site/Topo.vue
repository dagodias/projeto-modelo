<script setup lang="ts">
/**
 * O topo de todas as páginas: a logo, o menu e o botão do WhatsApp.
 * No celular, o menu abre num botão. Os itens do menu moram no app.config.ts.
 */
import type { NegocioPublico } from '@projeto/shared'
import { Menu, MessageCircle, X } from '@lucide/vue'

const props = defineProps<{ negocio?: NegocioPublico | null }>()

const { menu } = useAppConfig()
const route = useRoute()
const aberto = ref(false)

// Trocou de página, o menu do celular fecha.
watch(
  () => route.fullPath,
  () => {
    aberto.value = false
  },
)

const linkConversa = computed(() =>
  props.negocio ? linkWhatsapp(props.negocio.whatsapp, mensagemDoSite(props.negocio.nome)) : '',
)
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-stone-200/80 bg-white/85 backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-950/85"
    @keydown.esc="aberto = false"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
      <NuxtLink
        to="/"
        class="-m-1 shrink-0 rounded-lg p-1"
        :aria-label="negocio ? `${negocio.nome}, página inicial` : 'Página inicial'"
      >
        <SiteLogo />
      </NuxtLink>

      <nav aria-label="Principal" class="hidden md:block">
        <ul class="flex items-center gap-1">
          <li v-for="item in menu" :key="item.para">
            <NuxtLink
              :to="item.para"
              class="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 aria-[current=page]:bg-stone-100 aria-[current=page]:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800/70 dark:hover:text-white dark:aria-[current=page]:bg-stone-800/70 dark:aria-[current=page]:text-white"
            >
              {{ item.rotulo }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-2">
        <!-- O esconder fica numa caixa em volta: no próprio botão, a classe dele ganharia da hidden. -->
        <div v-if="linkConversa" class="hidden sm:block">
          <BaseBotao :para="linkConversa" tamanho="pequeno">
            <MessageCircle class="size-4" aria-hidden="true" />
            Falar pelo WhatsApp
          </BaseBotao>
        </div>
        <button
          type="button"
          class="-mr-2 inline-flex size-11 items-center justify-center rounded-lg text-stone-700 transition-colors hover:bg-stone-100 md:hidden dark:text-stone-200 dark:hover:bg-stone-800"
          :aria-expanded="aberto"
          aria-controls="menu-celular"
          @click="aberto = !aberto"
        >
          <X v-if="aberto" class="size-6" aria-hidden="true" />
          <Menu v-else class="size-6" aria-hidden="true" />
          <span class="sr-only">{{ aberto ? 'Fechar o menu' : 'Abrir o menu' }}</span>
        </button>
      </div>
    </div>

    <nav
      v-show="aberto"
      id="menu-celular"
      aria-label="Principal"
      class="border-t border-stone-200 md:hidden dark:border-stone-800"
    >
      <ul class="mx-auto max-w-6xl space-y-1 px-4 py-3 sm:px-6">
        <li v-for="item in menu" :key="item.para">
          <NuxtLink
            :to="item.para"
            class="flex h-12 items-center rounded-lg px-3 text-base font-medium text-stone-700 transition-colors hover:bg-stone-100 aria-[current=page]:bg-stone-100 aria-[current=page]:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:aria-[current=page]:bg-stone-800 dark:aria-[current=page]:text-white"
            @click="aberto = false"
          >
            {{ item.rotulo }}
          </NuxtLink>
        </li>
      </ul>
      <div v-if="linkConversa" class="mx-auto max-w-6xl px-4 pb-4 sm:hidden">
        <BaseBotao :para="linkConversa" bloco>
          <MessageCircle class="size-5" aria-hidden="true" />
          Falar pelo WhatsApp
        </BaseBotao>
      </div>
    </nav>
  </header>
</template>
