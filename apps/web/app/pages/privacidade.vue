<script setup lang="ts">
/**
 * A privacidade, em linguagem simples. Vale enquanto o site não guarda dados de quem visita.
 * Mudou o site (pedido, cadastro, pagamento, rastreador, formulário)? Mude este texto junto, e a data.
 */
const { data: negocio } = await useNegocio()

const atualizadaEm = '23 de novembro de 2026'

useSeoMeta({
  title: 'Privacidade',
  ogTitle: 'Privacidade',
  description: 'O que este site guarda sobre quem visita: nada além do necessário para funcionar.',
  ogDescription:
    'O que este site guarda sobre quem visita: nada além do necessário para funcionar.',
})

const nome = computed(() => negocio.value?.nome ?? 'este negócio')
</script>

<template>
  <div>
    <BaseCabecalho
      rotulo="Privacidade"
      titulo="Os seus dados"
      :subtitulo="`Atualizada em ${atualizadaEm}.`"
    />

    <BaseSecao>
      <div class="max-w-3xl space-y-10 text-stone-700 dark:text-stone-300">
        <section>
          <h2 class="text-xl font-semibold text-stone-900 dark:text-white">
            O que este site guarda
          </h2>
          <p class="mt-3">
            Nada sobre quem visita. O site não usa cookies, não tem rastreador nem anúncio e não
            pede cadastro.
          </p>
        </section>
        <section>
          <h2 class="text-xl font-semibold text-stone-900 dark:text-white">
            Quando você fala com a gente
          </h2>
          <p class="mt-3">
            Os links de contato só abrem o seu telefone, o seu WhatsApp ou o seu e-mail: o que você
            diz não passa por este site. A conversa fica entre você e {{ nome }}, só para responder
            você. No WhatsApp, ela também segue as regras de privacidade dele.
          </p>
        </section>
        <section>
          <h2 class="text-xl font-semibold text-stone-900 dark:text-white">
            Os registros do servidor
          </h2>
          <p class="mt-3">
            Como todo site, o servidor anota o endereço de internet (IP) de quem acessa, a data e a
            página pedida, só para a segurança. Esses registros são apagados em até 14 dias.
          </p>
        </section>
        <section>
          <h2 class="text-xl font-semibold text-stone-900 dark:text-white">Dúvidas</h2>
          <p class="mt-3">
            Fale com a gente pela
            <NuxtLink to="/contato" class="font-medium underline underline-offset-4"
              >página de contato</NuxtLink
            >.
          </p>
        </section>
      </div>
    </BaseSecao>
  </div>
</template>
