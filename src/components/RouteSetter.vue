<template>
  <div class="p-2 pb-3 flex flex-col gap-3 relative sm:p-3">
    <div
      class="absolute flex justify-center items-center -top-12 right-0 rotate-12 sm:-top-10 sm:-right-3 lg:-right-8 lg:-top-12"
    >
      <div
        v-if="totalHolds > 3"
        class="absolute right-full bg-rot-600 text-dill-100 px-2 py-1 -mr-3 rounded"
      >
        {{ difficultyName[grade] }}
      </div>
      <route-badge v-if="totalHolds > 3" class="text-rot-600 lg:w-18 lg:h-18" />
      <component
        v-if="totalHolds > 3"
        :is="difficultyIconComponents[grade]"
        class="text-dill-100 absolute lg:w-10 lg:h-10"
      />
    </div>
    <div class="grid grid-cols-14" role="grid">
      <button
        v-for="(item, index) in 112"
        ref="cellElements"
        :key="index"
        :disabled="index === 6"
        :tabindex="activeGridCell === index ? 0 : -1"
        :aria-label="holds[index] ? 'Remove hold' : 'Place hold'"
        @click="onGridClick(index)"
        class="relative leading-0 aspect-square flex justify-center items-center text-dill-400 text-lg group outline-none rounded-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dill-400 hover:text-rot-600 focus-visible:text-rot-600 focus-visible:text-3xl group select-none"
        @keydown.left.prevent="focusCell(cellToLeft)"
        @keydown.right.prevent="focusCell(cellToRight)"
        @keydown.up.prevent="focusCell(cellAbove)"
        @keydown.down.prevent="focusCell(cellBelow)"
      >
        <span class="absolute pointer-events-none group-hover:text-3xl">•</span>
        <template v-if="index === 6">
          <div class="relative flex gap-1 -top-10 right-34 w-0 h-0 sm:-top-11 sm:right-35">
            <div class="font-handwriting text-dill-800 shrink-0 relative top-0.5">Finish hold</div>
            <curved-arrow class="text-dill-400 shrink-0" />
          </div>
          <icon-hold-heart
            class="absolute pointer-events-none aspect-square h-auto text-dill-400"
            :class="sizeClasses['md']"
            :style="`rotate: -20deg;`"
          />
        </template>
        <template v-else-if="holds[index]">
          <component
            :is="shapeComponents[holds[index].shape]"
            class="absolute pointer-events-none aspect-square h-auto text-dill-600 group-hover:text-rot-600"
            :class="sizeClasses[holds[index].size]"
            :style="`rotate: ${holds[index].angle}deg;`"
          />
        </template>
      </button>
    </div>
    <div class="flex justify-between gap-4 px-2">
      <div class="flex justify-center items-center gap-2">
        <div class="text-sm">size:</div>
        <size-slider class="w-24" @change="onSizeChange" />
      </div>
      <jh-button @click="onClear">clear</jh-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import JhButton from '@/components/JhButton.vue'
import RouteBadge from '@/components/icons/RouteBadge.vue'
import SizeSlider from '@/components/SizeSlider.vue'
import IconSkull from '@/components/icons/IconSkull.vue'
import IconPepper from '@/components/icons/IconPepper.vue'
import IconBaby from '@/components/icons/IconBaby.vue'
import IconClap from '@/components/icons/IconClap.vue'
import IconHoldLong from '@/components/icons/IconHoldLong.vue'
import IconHoldCarolina from '@/components/icons/IconHoldCarolina.vue'
import IconHoldHeart from '@/components/icons/IconHoldHeart.vue'
import IconHoldRock from '@/components/icons/IconHoldRock.vue'
import IconHoldWings from '@/components/icons/IconHoldWings.vue'
import CurvedArrow from '@/components/icons/CurvedArrow.vue'

const holds = ref<(Hold | null)[]>(new Array(112).fill(null))
const activeGridCell = ref<number>(0)
const selectedSize = ref<keyof typeof sizeClasses>('md')
const cellElements = ref<Array<HTMLElement>>([])

const totalHolds = computed(() => holds.value.filter((hold) => hold !== null).length)

const cellToLeft = computed(() => {
  const toLeft = activeGridCell.value % 14 === 0 ? null : activeGridCell.value - 1
  return toLeft === 6 ? 5 : toLeft
})

const cellToRight = computed(() => {
  const toRight = activeGridCell.value % 14 === 13 ? null : activeGridCell.value + 1
  return toRight === 6 ? 7 : toRight
})

const cellAbove = computed(() => {
  return activeGridCell.value < 14 ? null : activeGridCell.value - 14
})

const cellBelow = computed(() => {
  return activeGridCell.value > 97 ? null : activeGridCell.value + 14
})

const leftColumnGroup = createColumnGroup(0, 3)
const centerColumnGroup = createColumnGroup(4, 8)
const rightColumnGroup = createColumnGroup(9, 13)

function createColumnGroup(first: number, last: number) {
  const cells = new Array(112)
  let cellCount = 0
  for (let i = 0; i < 112; i++) {
    const column = i % 14
    if (column >= first && column <= last) {
      cells[i] = true
      cellCount++
    }
  }
  return { cells, cellCount }
}

const leftGroupGoldZoneFilled = computed(() => {
  return Boolean([4, 18, 32, 5, 19, 33].find((index) => holds.value[index]))
})

const rightGroupGoldZoneFilled = computed(() => {
  return Boolean([7, 8, 21, 22, 35, 36].find((index) => holds.value[index]))
})

function getColumnDensity(columnCells: Array<undefined | number>, columnCellCount: number) {
  const numHolds = holds.value.reduce((total, hold, index) => {
    return columnCells[index] && hold ? total + 1 : total
  }, 0)
  return numHolds / columnCellCount
}

const rightGroupDensity = computed(() => {
  return getColumnDensity(rightColumnGroup.cells, rightColumnGroup.cellCount)
})

const leftGroupDensity = computed(() => {
  return getColumnDensity(leftColumnGroup.cells, leftColumnGroup.cellCount)
})

const centerGroupDensity = computed(() => {
  return getColumnDensity(centerColumnGroup.cells, centerColumnGroup.cellCount)
})

const leftGroupLargestGap = computed(() => {
  return getLargestEmptyRowGap(leftColumnGroup.cells)
})

const rightGroupLargestGap = computed(() => {
  return getLargestEmptyRowGap(rightColumnGroup.cells)
})

const centerGroupLargestGap = computed(() => {
  return getLargestEmptyRowGap(centerColumnGroup.cells)
})

const centerGroupDifficulty = computed(() => {
  return getDifficulty(centerGroupDensity.value, centerGroupLargestGap.value, true)
})

const leftGroupColumnDifficulty = computed(() => {
  return getDifficulty(
    leftGroupDensity.value,
    leftGroupLargestGap.value,
    leftGroupGoldZoneFilled.value,
  )
})

const rightGroupColumnDifficulty = computed(() => {
  return getDifficulty(
    rightGroupDensity.value,
    rightGroupLargestGap.value,
    rightGroupGoldZoneFilled.value,
  )
})

function getDifficulty(density: number, largestGap: number, goldZoneFilled: boolean) {
  let difficulty = 4
  if (density >= 0.2 && largestGap < 2) difficulty = 1
  else if (density >= 0.15 && largestGap < 3) difficulty = 2
  else if (density >= 0.1 && largestGap < 4) difficulty = 3
  if (!goldZoneFilled) difficulty = 4
  return difficulty
}

function getLargestEmptyRowGap(cells: boolean[]): number {
  let maxEmptyRows = 0
  let currentEmptyRows = 0

  for (let row = 0; row < 8; row++) {
    let isRowEmpty = true
    for (let col = 0; col < 14; col++) {
      const cellIndex = row * 14 + col
      if (cells[cellIndex] && holds.value[cellIndex]) {
        isRowEmpty = false
        break
      }
    }
    if (isRowEmpty) {
      currentEmptyRows++
      maxEmptyRows = Math.max(maxEmptyRows, currentEmptyRows)
    } else {
      currentEmptyRows = 0
    }
  }

  return maxEmptyRows
}

const grade = computed(() => {
  return Math.min(
    centerGroupDifficulty.value,
    leftGroupColumnDifficulty.value,
    rightGroupColumnDifficulty.value,
  )
})

function onSizeChange(selection: number) {
  selectedSize.value = ['sm', 'md', 'lg'][selection] as keyof typeof sizeClasses
}

function focusCell(cell: null | number) {
  if (cell === null || cell === 6) return
  activeGridCell.value = cell
  cellElements.value[cell].focus()
}

const shapes = [
  { name: 'carolina', maxAngle: 24 },
  { name: 'heart', maxAngle: 24 },
  { name: 'rock', maxAngle: 100 },
  { name: 'wings', maxAngle: 48 },
  { name: 'long', maxAngle: 24 },
] as const

const sizeClasses = {
  sm: 'w-three-fourths',
  md: 'w-full',
  lg: 'w-full-150',
} as const

const difficultyName: Record<number, string> = {
  1: 'Easy',
  2: 'Moderate',
  3: 'Hard',
  4: 'Expert',
}

function onGridClick(cell: number): null | void {
  activeGridCell.value = cell
  if (holds.value[cell]) return (holds.value[cell] = null)
  const shape = shapes[randomIndexBetween(0, shapes.length - 1)]
  holds.value.splice(cell, 1, {
    shape: shape.name,
    size: selectedSize.value,
    angle: randomIndexBetween(-shape.maxAngle, shape.maxAngle),
  })
}

function randomIndexBetween(min: number, max: number) {
  min = Math.ceil(min)
  return Math.floor(Math.random() * (Math.floor(max) - min + 1)) + min
}

function onClear(): void {
  holds.value.fill(null)
}

const shapeComponents: ShapeComponentsInterface = {
  carolina: IconHoldCarolina,
  heart: IconHoldHeart,
  rock: IconHoldRock,
  wings: IconHoldWings,
  long: IconHoldLong,
}

const difficultyIconComponents: Record<keyof typeof difficultyName, typeof IconSkull> = {
  1: IconBaby,
  2: IconClap,
  3: IconPepper,
  4: IconSkull,
}

interface Hold {
  shape: (typeof shapes)[number]['name']
  size: keyof typeof sizeClasses
  angle: number
}

type ShapeComponentsInterface = Record<(typeof shapes)[number]['name'], typeof IconHoldCarolina>
</script>
