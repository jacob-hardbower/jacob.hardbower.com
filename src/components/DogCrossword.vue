<template>
  <div class="@container">
    <div class="px-4 pt-4 pb-3 flex flex-col items-center gap-y-6 gap-x-3 @sm:p-5 @sm:flex-row">
      <div>
        <h3 class="font-display text-lg mb-1.5">Across</h3>
        <ol class="text-xs mb-4">
          <li>1. <label for="12">Vocalization directed toward deer</label></li>
          <li>2. <label for="31">Actress Streisand or Stanwyck</label></li>
          <li>3. <label for="52">A favorite pastime</label></li>
          <li>6. <label for="71">Rough-housing, wrestling, fetch</label></li>
        </ol>

        <h3 class="font-display text-lg mb-1.5">Down</h3>
        <ol class="text-xs">
          <li>1. <label for="12">Legumes used in chili</label></li>
          <li>4. <label for="53">Dog-walking tool</label></li>
          <li>5. <label for="56">Occasionally, on the chair leg</label></li>
        </ol>
      </div>
      <div class="inline-grid grid-cols-7 grid-rows-9 shrink-0">
        <div
          v-for="({ row, col, wordNums }, index) in cells"
          :key="index"
          class="relative col-span-1 col-start-2 row-start-5"
          :style="`grid-column-start: ${col}; grid-row-start: ${row}`"
        >
          <sup
            v-if="isFirstCharacter(row, col, wordNums)"
            class="absolute top-1.5 left-0.5 text-[8px]"
            >{{ isFirstCharacter(row, col, wordNums)[0] }}</sup
          >
          <input
            ref="inputs"
            type="text"
            maxlength="1"
            :id="`${row}${col}`"
            pattern="[a-zA-Z]*"
            autocomplete="off"
            class="uppercase text-center w-6 h-6 outline-none inset-ring-1 ring-1 inset-ring-dill-400 rounded-xs focus-visible:inset-ring-2 focus-visible:inset-ring-white focus-visible:z-10"
            :class="[
              { 'inset-ring-rot-600 ring-red-600': inputValidity[`${row}${col}`] === 'invalid' },
              {
                'inset-ring-dill-600 ring-dill-600 bg-dill-400 text-dill-100':
                  inputValidity[`${row}${col}`] === 'valid',
              },
              { 'inset-ring-dill-400 ring-dill-400': !inputValidity[`${row}${col}`] },
            ]"
            @input="
              onInput(row, col, wordNums, ($event.target as HTMLInputElement)?.value || '', index)
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import JSConfetti from 'js-confetti'

const confetti = new JSConfetti()

const inputs = ref<HTMLInputElement[]>()

type Validity = 'valid' | 'invalid' | undefined

const inputValidity = ref<Record<string, Validity>>({})

const complete = computed(
  () =>
    Object.keys(inputValidity.value).length === cells.length &&
    Object.values(inputValidity.value).every((validity) => validity === 'valid'),
)

const answers: Answers = {
  1: { across: 'bark', down: 'beans', col: 2, row: 1 },
  2: { across: 'barbara', col: 1, row: 3 },
  3: { across: 'sleep', col: 2, row: 5 },
  4: { down: 'leash', col: 3, row: 5 },
  5: { down: 'pee', col: 6, row: 5 },
  6: { across: 'play', col: 1, row: 7 },
}

const strippedAnswers: AnswerArray = Object.fromEntries(
  Object.entries(answers).map(([key, { across, down }]) => [
    Number(key),
    {
      across: across ? across.split('').map(() => '') : undefined,
      down: down ? down.split('').map(() => '') : undefined,
    },
  ]),
) as AnswerArray

const userAnswers = ref<AnswerArray>({ ...strippedAnswers })

function generateCells(answers: Answers) {
  const cellMap: { [key: string]: { row: number; col: number; wordNums: AnswerNumber[] } } = {}

  const addCell = (row: number, col: number, num: AnswerNumber) => {
    const key = `${row}-${col}`
    if (!cellMap[key]) {
      cellMap[key] = { row, col, wordNums: [num] }
    } else {
      cellMap[key].wordNums.push(num)
    }
  }

  Object.entries(answers).forEach(([wordNum, answer]) => {
    const num = Number(wordNum) as AnswerNumber
    if (answer.across) {
      for (let i = 0; i < answer.across.length; i++) {
        addCell(answer.row, answer.col + i, num)
      }
    }
    if (answer.down) {
      for (let i = 0; i < answer.down.length; i++) {
        addCell(answer.row + i, answer.col, num)
      }
    }
  })

  return Object.values(cellMap)
}

function isFirstCharacter(row: number, col: number, wordNums: AnswerNumber[]) {
  let firstCharOf: AnswerNumber[] = []
  wordNums.forEach((wordNum: AnswerNumber) => {
    if (answers[wordNum].col === col && answers[wordNum].row === row) firstCharOf.push(wordNum)
  })

  return firstCharOf
}

const cells: Cell[] = generateCells(answers)

watch(complete, () => {
  if (complete.value)
    confetti.addConfetti({
      confettiColors: ['#e6e7dc', '#d1d3c5', '#8e9175', '#6b6e59', '#4d4f3e', '#cd310f'],
      confettiNumber: 120,
    })
})

function onInput(
  row: number,
  col: number,
  wordNums: AnswerNumber[],
  character: string,
  inputIndex: number,
) {
  wordNums.forEach((wordNum) => {
    let charIndex: AnswerNumber
    let directions: ('down' | 'across')[] = []
    if (col === answers[wordNum].col) {
      charIndex = row - answers[wordNum].row
      directions.push('down')
    }
    if (row === answers[wordNum].row) {
      charIndex = col - answers[wordNum].col
      directions.push('across')
    }

    directions.forEach((direction) => {
      if (userAnswers.value[wordNum][direction]) {
        userAnswers.value[wordNum][direction]![charIndex] = character
      }
    })
  })

  checkValidity(row, col, wordNums)

  if (!inputs.value || !inputs.value.length || !character) return
  if (inputIndex + 1 < inputs.value?.length) inputs.value[inputIndex + 1].focus()
}

function checkValidity(row: number, col: number, wordNums: AnswerNumber[]) {
  wordNums.forEach((wordNum) => {
    let directions: ('down' | 'across')[] = []
    if (col === answers[wordNum].col) {
      directions.push('down')
    }
    if (row === answers[wordNum].row) {
      directions.push('across')
    }

    directions.forEach((direction) => {
      if (userAnswers.value[wordNum][direction]) {
        if (!userAnswers.value[wordNum][direction].every((letter) => letter)) {
          console.log('okay')

          userAnswers.value[wordNum][direction].forEach((letter, index) => {
            const gridRow = direction === 'across' ? row : answers[wordNum].row + index
            const gridCol = direction === 'down' ? col : answers[wordNum].col + index
            inputValidity.value[`${gridRow}${gridCol}`] = undefined
          })
        } else {
          const wordValidity = userAnswers.value[wordNum][direction].reduce(
            (validity, letter, index) => {
              return validity === 'invalid' ||
                letter !== answers[wordNum][direction]?.split('')[index]
                ? 'invalid'
                : 'valid'
            },
            'valid',
          )

          userAnswers.value[wordNum][direction].forEach((letter, index) => {
            const gridRow = direction === 'across' ? row : answers[wordNum].row + index
            const gridCol = direction === 'down' ? col : answers[wordNum].col + index
            inputValidity.value[`${gridRow}${gridCol}`] = wordValidity as Validity
          })
        }
      }
    })
  })
}

type Answer = {
  across?: string
  down?: string
  col: number
  row: number
}
type UserAnswer = {
  across?: string[]
  down?: string[]
}
type AnswerNumber = 1 | 2 | 3 | 4 | 5 | 6
type Answers = Record<AnswerNumber, Answer>
type AnswerArray = Record<AnswerNumber, UserAnswer>

interface Cell {
  row: number
  col: number
  wordNums: AnswerNumber[]
}
</script>
