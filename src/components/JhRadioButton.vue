<template>
  <label
    class="w-5 h-5 border-2 text-sm flex items-center rounded-full relative border-dill-400 select-none before:absolute before:w-3 before:h-3 before:rounded-full before:left-0.5"
    :class="{ 'before:bg-dill-800': checked }"
  >
    <input
      :name
      :required
      type="radio"
      @change="$emit('change')"
      :checked
      class="appearance-none outline-none self-center absolute w-full h-full rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dill-400"
    />
    <div class="ml-6.5">{{ label }}</div>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  checked: boolean
  label: string | undefined
  name: string
  required: boolean
}>()

defineEmits(['change'])
</script>
