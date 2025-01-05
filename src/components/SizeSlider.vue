<template>
  <div
    ref="container"
    class="relative flex items-center h-6"
    role="slider"
    :aria-valuenow="regionLabels[size]"
  >
    <div class="w-full h-1 bg-dill-400 rounded-xs"></div>
    <button
      v-for="option in [0, 1, 2]"
      :key="option"
      :disabled="option === size"
      :aria-label="regionLabels[option]"
      :class="positionClasses[option as keyof typeof positionClasses]"
      class="absolute w-1/3 h-4"
      tabindex="-1"
      @click="selectSize(option)"
    ></button>
    <button
      ref="handle"
      class="cursor-grab absolute flex justify-center items-center rounded-xs w-1/3 h-6 before:absolute before:w-2 before:h-full before:bg-dill-600 before:rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dill-400"
      :class="positionClasses[size as keyof typeof positionClasses]"
      :style="`left: ${dragPos}px;`"
      @keydown.left="selectSize(size - 1)"
      @keydown.right="selectSize(size + 1)"
    ></button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const size = ref<number>(1)
const container = ref<HTMLElement>()
const handle = ref<HTMLElement>()

const dragPos = ref<number | null>()

function onMove(event: MouseEvent | TouchEvent) {
  if (!container.value || !handle.value) return
  const { width, left } = container.value.getBoundingClientRect()
  const cursorPosX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
  dragPos.value =
    Math.max(Math.min(width, cursorPosX - left), 0) - handle.value.getBoundingClientRect().width / 2
}

function onStop(e: MouseEvent | TouchEvent) {
  if (!container.value || !dragPos.value || !handle.value) return
  const containerWidth = container.value.getBoundingClientRect().width
  const handleWidth = handle.value.getBoundingClientRect().width / 2
  if (dragPos.value + handleWidth < containerWidth / 3) selectSize(0)
  else if (dragPos.value + handleWidth < (containerWidth / 3) * 2) selectSize(1)
  else selectSize(2)
  dragPos.value = null
  const [move, end] =
    window.TouchEvent && e instanceof TouchEvent
      ? ['touchmove', 'touchend']
      : ['mousemove', 'mouseup']
  document.removeEventListener(move as keyof DocumentEventMap, onMove as EventListener)
  document.removeEventListener(end as keyof DocumentEventMap, onStop as EventListener)
}

function onStart(e: TouchEvent | MouseEvent) {
  if (e.cancelable) e.preventDefault()
  const [move, end] =
    window.TouchEvent && e instanceof TouchEvent
      ? ['touchmove', 'touchend']
      : ['mousemove', 'mouseup']
  document.addEventListener(move as keyof DocumentEventMap, onMove as EventListener)
  document.addEventListener(end as keyof DocumentEventMap, onStop as EventListener)
}

onMounted(() => {
  if (handle.value) {
    handle.value.addEventListener('mousedown' as keyof DocumentEventMap, onStart as EventListener)
    handle.value.addEventListener(
      'touchstart' as keyof DocumentEventMap,
      onStart as EventListener,
      { passive: false },
    )
  }
})

onBeforeUnmount(() => {
  if (handle.value) {
    handle.value.removeEventListener(
      'mousedown' as keyof DocumentEventMap,
      onStart as EventListener,
    )
    handle.value.removeEventListener(
      'touchstart' as keyof DocumentEventMap,
      onStart as EventListener,
    )
  }
})

const positionClasses = ['', 'left-1/3', 'right-0']

const regionLabels = ['Small', 'Medium', 'Large']

const emit = defineEmits(['change'])

function selectSize(selectedSize: number) {
  size.value = Math.max(Math.min(selectedSize, positionClasses.length - 1), 0)
  emit('change', size.value)
}
</script>
