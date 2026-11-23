<script setup lang="ts">
/**
 * A logo do site, no topo e no rodapé. Para trocar, substitua o arquivo public/logo.svg pela sua, com o mesmo nome.
 * Se a sua logo for PNG, salve como public/logo.png e troque o endereço abaixo. Fica bem com uns 40 de altura.
 * nome: o texto para quem não enxerga a imagem (no topo, o link em volta já diz; no rodapé, diga o nome).
 */
defineProps<{ nome?: string }>()
</script>

<template>
  <img src="/logo.svg" :alt="nome ?? ''" width="124" height="40" class="h-9 w-auto" />
</template>
