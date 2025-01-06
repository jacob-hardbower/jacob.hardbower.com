import { computed, type Ref } from 'vue'

export function useGrid(activeCell: Ref<number>, cols: number = 14) {
  const cellToLeft = computed(() => {
    const toLeft = activeCell.value % cols === 0 ? null : activeCell.value - 1
    return toLeft === 6 ? 5 : toLeft
  })

  const cellToRight = computed(() => {
    const toRight = activeCell.value % cols === 13 ? null : activeCell.value + 1
    return toRight === 6 ? 7 : toRight
  })

  const cellAbove = computed(() => {
    return activeCell.value < cols ? null : activeCell.value - cols
  })

  const cellBelow = computed(() => {
    return activeCell.value > 97 ? null : activeCell.value + cols
  })

  return {
    cellToLeft,
    cellToRight,
    cellAbove,
    cellBelow,
  }
}
