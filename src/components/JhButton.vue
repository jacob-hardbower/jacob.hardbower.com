<template>
  <component
    :is="to ? RouterLink : 'button'"
    :to="to ? { name: to } : null"
    :type="to ? null : 'button'"
    class="bg-dill-400 text-dill-100 text-sm rounded-xs px-2 inline-block pb-0.5 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dill-400 select-none"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  to: string
}>()
</script>
