<script setup lang="ts">
/**
 * A casca de todas as páginas: o link de pular para o conteúdo, o topo, a página e o rodapé.
 * O layout pede os dados do negócio uma vez e passa para o topo e o rodapé.
 */
const { data: negocio } = await useNegocio()
const { enderecoDoSite } = useAppConfig()
const route = useRoute()
const endereco = enderecoDoSite.replace(/\/+$/, '')
// A página privada (o painel, a entrada, o pedido com o código secreto) não ganha endereço oficial nem og:url.
const enderecoDaPagina = computed(() =>
  endereco && !ehPaginaPrivada(route.path) ? endereco + route.path : undefined,
)

// O título de cada página ganha o nome do negócio no fim: "Contato · Meu Negócio".
useHead({
  titleTemplate: (titulo) => {
    const nome = negocio.value?.nome
    if (!nome) return titulo ?? ''
    return titulo && titulo !== nome ? `${titulo} · ${nome}` : nome
  },
  link: computed(() =>
    enderecoDaPagina.value ? [{ rel: 'canonical', href: enderecoDaPagina.value }] : [],
  ),
})

// A prévia do link (WhatsApp, Facebook): o nome, a imagem e o endereço. O título e a descrição vêm de cada página.
useSeoMeta({
  ogSiteName: () => negocio.value?.nome,
  ogType: 'website',
  ogLocale: 'pt_BR',
  ogImage: endereco ? `${endereco}/previa.png` : '/previa.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogUrl: () => enderecoDaPagina.value,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <a
      href="#conteudo"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-botao focus:bg-white focus:px-4 focus:py-2.5 focus:font-semibold focus:shadow-lg dark:focus:bg-stone-900"
    >
      Pular para o conteúdo
    </a>
    <SiteTopo :negocio="negocio" />
    <main id="conteudo" tabindex="-1" class="flex-1 focus:outline-none">
      <slot />
    </main>
    <SiteRodape :negocio="negocio" />
  </div>
</template>
