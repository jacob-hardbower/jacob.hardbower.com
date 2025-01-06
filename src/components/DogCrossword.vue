<template>
  <div class="@container" role="group" aria-label="Crossword puzzle">
    <div class="px-4 pt-4 pb-4 flex flex-col items-center gap-y-6 gap-x-3 @sm:p-5 @sm:flex-row">
      <div>
        <template v-for="{ title, clues, direction } in clueSections" :key="direction">
          <h3 class="font-display text-lg mb-1.5">{{ title }}</h3>
          <ol :class="['text-xs flex flex-col gap-1', { 'mb-2': direction === 'across' }]">
            <li v-for="clue in clues" :key="`${clue.number}-${direction}`" class="flex gap-1.5">
              {{ clue.number }}.
              <label
                :for="`${answers[clue.number].row}${answers[clue.number].col}`"
                class="text-pretty"
                >{{ clue.text }}</label
              >
            </li>
          </ol>
        </template>
      </div>
      <div class="inline-grid grid-cols-7 grid-rows-9 shrink-0" role="grid">
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
            :aria-label="`Row ${row}, Column ${col}`"
            pattern="[a-zA-Z]*"
            autocomplete="off"
            class="uppercase text-center w-7 h-7 outline-none inset-ring-1 ring-1 inset-ring-dill-400 rounded-xs focus-visible:inset-ring-2 focus-visible:inset-ring-white focus-visible:z-10"
            :class="[
              { 'inset-ring-rot-600 ring-red-600': inputValidity[`${row}${col}`] === 'invalid' },
              {
                'inset-ring-dill-600 ring-dill-600 bg-dill-400 text-dill-100':
                  inputValidity[`${row}${col}`] === 'valid',
              },
              { 'inset-ring-dill-400 ring-dill-400': !inputValidity[`${row}${col}`] },
            ]"
            @input="
              onInput(row, col, wordNums, ($event.target as HTMLInputElement)?.value ?? '', index)
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

type UserAnswer = {
  across?: string[]
  down?: string[]
}

type Answer = {
  across?: string
  down?: string
  acrossClue?: string
  downClue?: string
  col: number
  row: number
}

type AnswerNumber = 1 | 2 | 3 | 4 | 5 | 6
type Answers = Record<AnswerNumber, Answer>
type AnswerArray = Record<AnswerNumber, UserAnswer>

interface Cell {
  row: number
  col: number
  wordNums: AnswerNumber[]
}

const answers: Answers = {
  1: {
    across: 'bark',
    down: 'beans',
    acrossClue: 'Vocalization directed toward deer',
    downClue: 'Legumes used in chili',
    col: 2,
    row: 1,
  },
  2: {
    across: 'barbara',
    acrossClue: 'Actress Streisand or Stanwyck',
    col: 1,
    row: 3,
  },
  3: {
    across: 'sleep',
    acrossClue: 'A favorite pastime',
    col: 2,
    row: 5,
  },
  4: {
    down: 'leash',
    downClue: 'Dog-walking tool',
    col: 3,
    row: 5,
  },
  5: {
    down: 'pee',
    downClue: 'Occasionally, on the chair leg',
    col: 6,
    row: 5,
  },
  6: {
    across: 'play',
    acrossClue: 'Rough-housing, wrestling, fetch',
    col: 1,
    row: 7,
  },
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

function generateCells(answers: Answers): Cell[] {
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

function isFirstCharacter(row: number, col: number, wordNums: AnswerNumber[]): AnswerNumber[] {
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
        userAnswers.value[wordNum][direction]![charIndex] = character.toLowerCase()
      }
    })
  })

  checkValidity(row, col, wordNums)

  if (!inputs.value || !inputs.value.length || !character) return
  if (inputIndex + 1 < inputs.value?.length) inputs.value[inputIndex + 1].focus()
}

function checkValidity(row: number, col: number, wordNums: AnswerNumber[]) {
  wordNums.forEach((wordNum) => {
    const directions: ('down' | 'across')[] = []
    if (col === answers[wordNum].col) directions.push('down')
    if (row === answers[wordNum].row) directions.push('across')

    directions.forEach((direction) => {
      const word = userAnswers.value[wordNum][direction]
      if (!word) return

      const coordinates = word.map((_, index) => ({
        row: direction === 'across' ? row : answers[wordNum].row + index,
        col: direction === 'down' ? col : answers[wordNum].col + index,
      }))

      if (!word.every((letter) => letter)) {
        coordinates.forEach(({ row, col }) => {
          inputValidity.value[`${row}${col}`] = undefined
        })
        return
      }

      const isValid = word.every(
        (letter, index) => letter === answers[wordNum][direction]?.split('')[index],
      )

      coordinates.forEach(({ row, col }) => {
        inputValidity.value[`${row}${col}`] = isValid ? 'valid' : 'invalid'
      })
    })
  })
}

function getClues(direction: 'across' | 'down') {
  return computed(() =>
    Object.entries(answers)
      .filter(([_, answer]) => answer[direction])
      .map(([num, answer]) => ({
        number: Number(num) as AnswerNumber,
        text: answer[`${direction}Clue`],
      }))
      .sort((a, b) => a.number - b.number),
  )
}

const acrossClues = getClues('across')
const downClues = getClues('down')

const clueSections = [
  { title: 'Across', clues: acrossClues.value, direction: 'across' as const },
  { title: 'Down', clues: downClues.value, direction: 'down' as const },
]
</script>
