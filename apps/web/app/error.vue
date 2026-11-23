<script setup lang="ts">
/** A página de erro: a que não existe (404) e a que falhou. Com o topo e o rodapé, para a pessoa não se perder. */
import type { NuxtError } from '#app'
import { ArrowLeft } from '@lucide/vue'

const props = defineProps<{ error: NuxtError }>()

const naoExiste = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: () => (naoExiste.value ? 'Página não encontrada' : 'Algo deu errado'),
  robots: 'noindex',
})

function voltar() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <NuxtLayout>
    <BaseSecao>
      <div class="mx-auto max-w-xl py-8 text-center sm:py-16">
        <p class="text-sm font-semibold text-marca-700 dark:text-marca-400">
          Erro {{ error.statusCode }}
        </p>
        <h1 class="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {{ naoExiste ? 'Esta página não existe' : 'Algo deu errado' }}
        </h1>
        <p class="mt-4 text-lg text-pretty text-stone-600 dark:text-stone-400">
          {{
            naoExiste
              ? 'O endereço pode ter mudado ou ter sido digitado errado.'
              : 'Tente de novo daqui a pouco. Se continuar, fale com a gente pela página de contato.'
          }}
        </p>
        <div class="mt-8 flex justify-center">
          <BaseBotao @click="voltar">
            <ArrowLeft class="size-5" aria-hidden="true" />
            Voltar ao início
          </BaseBotao>
        </div>
      </div>
    </BaseSecao>
  </NuxtLayout>
</template>
