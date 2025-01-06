<template>
  <div class="min-h-64">
    <h3 tabindex="-1" ref="heading" class="mb-3 text-lg font-display outline-none">
      <span class="block" v-for="line in title" :key="line">{{ line }}</span>
    </h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string[]
  body: string
  button: string
}>()

const heading = ref<HTMLElement>()

defineEmits(['click'])

defineExpose({
  focus: () => {
    heading.value?.focus()
  },
})
</script>
