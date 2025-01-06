<template>
  <label
    class="border-2 border-dill-400 relative rounded-xs focus-within:rounded-xs"
    :class="checked ? 'bg-dill-400' : 'bg-dill-100'"
  >
    <input
      ref="input"
      :tabindex="active ? 0 : -1"
      :aria-label="label"
      type="checkbox"
      class="appearance-none absolute w-full h-full outline-none rounded-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dill-400"
      :checked
      @change="$emit('change')"
      @keydown.left.prevent="$emit('left')"
      @keydown.right.prevent="$emit('right')"
      @keydown.up.prevent="$emit('up')"
      @keydown.down.prevent="$emit('down')"
    />
  </label>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'

const props = defineProps<{
  checked: boolean
  active: boolean
  label: string
}>()

const input = ref<HTMLInputElement>()

watch(
  () => props.active,
  () => {
    if (props.active) input.value?.focus()
  },
)

defineEmits<{
  (e: 'change'): void
  (e: 'up'): void
  (e: 'down'): void
  (e: 'left'): void
  (e: 'right'): void
}>()
</script>
