<template>
  <label
    class="w-6 h-6 border-2 border-dill-400 relative rounded-xs focus-within:rounded-xs"
    :class="checked ? 'bg-dill-400' : 'bg-dill-100'"
  >
    <input
      type="checkbox"
      class="appearance-none absolute w-full h-full outline-none rounded-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dill-400"
      :checked
      @change="$emit('change')"
    />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  checked: boolean
}>()

defineEmits(['change'])
</script>
