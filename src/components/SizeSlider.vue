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

function onMouseMove(event: MouseEvent) {
  if (!container.value || !handle.value) return
  const rect = container.value.getBoundingClientRect()
  const containerWidth = rect.width
  dragPos.value =
    Math.max(Math.min(containerWidth, event.clientX - rect.left), 0) -
    handle.value.getBoundingClientRect().width / 2
}

function onMouseUp() {
  if (!container.value || !dragPos.value || !handle.value) return
  const containerWidth = container.value.getBoundingClientRect().width
  const handleWidth = handle.value.getBoundingClientRect().width / 2
  if (dragPos.value + handleWidth < containerWidth / 3) selectSize(0)
  else if (dragPos.value + handleWidth < (containerWidth / 3) * 2) selectSize(1)
  else selectSize(2)
  dragPos.value = null
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

function onMouseDown(e: TouchEvent | MouseEvent) {
  const [move, end] = e instanceof TouchEvent ? ['touchmove', 'touchend'] : ['mousemove', 'mouseup']
  console.log(move, end)

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

onMounted(() => {
  if (handle.value) {
    handle.value.addEventListener('mousedown', onMouseDown)
  }
})

onBeforeUnmount(() => {
  if (handle.value) {
    handle.value.removeEventListener('mousedown', onMouseDown)
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
