<template>
  <router-view />
</template>

<script setup lang="ts">
import { useHead } from 'unhead'
import { RouterView } from 'vue-router'

useHead({
  titleTemplate: 'Jacob Hardbower | %s',
})
</script>
