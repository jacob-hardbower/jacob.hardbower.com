<template>
  <label
    class="w-8 h-5 border text-xs flex justify-center items-center border-dill-400 relative rounded-xs focus-within:rounded-xs"
    :class="checked ? 'bg-dill-400 text-dill-100' : 'bg-dill-100'"
  >
    <input
      name="bpm"
      type="radio"
      @change="$emit('change')"
      :checked
      class="appearance-none absolute w-full h-full outline-none rounded-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dill-400"
    />
    <div>{{ bpm }}</div>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  checked: boolean
  bpm: number
}>()

defineEmits(['change'])
</script>
