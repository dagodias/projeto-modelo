<script setup lang="ts">
/**
 * O aviso: uma mensagem curta para quem está na página.
 * tipo: info, sucesso, atencao ou erro (o de erro e o de atenção são lidos na hora por quem usa leitor de tela).
 */
import { CircleAlert, CircleCheck, Info, TriangleAlert } from '@lucide/vue'

const props = withDefaults(
  defineProps<{ tipo?: 'info' | 'sucesso' | 'atencao' | 'erro'; titulo?: string }>(),
  { tipo: 'info', titulo: undefined },
)

const estilos = {
  info: {
    icone: Info,
    classes:
      'border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-100',
  },
  sucesso: {
    icone: CircleCheck,
    classes:
      'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100',
  },
  atencao: {
    icone: TriangleAlert,
    classes:
      'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100',
  },
  erro: {
    icone: CircleAlert,
    classes:
      'border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/50 dark:text-red-100',
  },
}

const estilo = computed(() => estilos[props.tipo])
</script>

<template>
  <div
    :role="tipo === 'erro' || tipo === 'atencao' ? 'alert' : 'status'"
    class="flex gap-3 rounded-cartao border p-4"
    :class="estilo.classes"
  >
    <component :is="estilo.icone" class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
    <div class="text-sm leading-6">
      <p v-if="titulo" class="font-semibold">{{ titulo }}</p>
      <div :class="titulo && 'mt-0.5'"><slot /></div>
    </div>
  </div>
</template>
