<template>
  <div class="min-h-63.5">
    <h3 tabindex="-1" ref="heading" class="mb-3 text-lg font-display outline-none">
      {{ title }}
    </h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps({
  title: String,
  body: String,
  button: String,
})

const heading = ref<HTMLElement>()

onMounted(() => {
  heading.value?.focus()
})

defineEmits(['click'])
</script>
