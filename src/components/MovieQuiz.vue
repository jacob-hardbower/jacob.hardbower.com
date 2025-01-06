<template>
  <div class="@container">
    <div class="px-4 pt-5 pb-3 @sm:px-5">
      <movie-quiz-step
        v-if="step !== FINAL_STEP"
        ref="quizStep"
        :title="quizSteps[step].title"
        :aria-label="`Quiz step ${step + 1} of ${FINAL_STEP}`"
      >
        <div>
          <p v-if="quizSteps[step].body" class="mb-8 text-sm">
            {{ quizSteps[step].body }}
          </p>
          <form class="flex flex-col items-start gap-3" @submit.prevent="submit">
            <jh-radio-button
              v-for="(option, index) in quizSteps[step].options"
              :key="option"
              :required="true"
              :name="`quiz-${step}`"
              :checked="userInput[step] === quizSteps[step].options?.[index].toLowerCase()"
              :label="quizSteps[step].options?.[index]"
              @change="onChange(quizSteps[step].options?.[index].toLowerCase() as MovieKey)"
            />
            <jh-button type="submit" class="mt-4">{{ quizSteps[step].button }}</jh-button>
          </form>
        </div>
      </movie-quiz-step>
      <movie-quiz-step
        v-else
        ref="resultsStep"
        :title="[
          'After countless calculations, we’ve selected a movie that matches your criteria.',
        ]"
      >
        <form @submit.prevent="restart">
          <article class="p-3.5 bg-dill-200">
            <div class="mb-1">
              <h4 class="font-display text-rot-600 text-2xl inline mr-1">
                {{ selectedMovie.name }}
              </h4>
              <span class="text-xs">({{ selectedMovie.year }})</span>
            </div>
            <div class="text-xs">{{ selectedMovie.description }}</div>
          </article>
          <jh-button type="submit" class="mt-4">start over</jh-button>
        </form>
      </movie-quiz-step>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MovieQuizStep from '@/components/MovieQuizStep.vue'
import JhRadioButton from '@/components/JhRadioButton.vue'
import JhButton from '@/components/JhButton.vue'
import {
  movieMap,
  type MovieKey,
  type Shape,
  type Color,
  type Temp,
  type Element,
  type Speed,
} from '@/data/movieData'
import { quizSteps } from '@/data/quizSteps'

const step = ref<number>(0)
const quizStep = ref<HTMLElement>()
const resultsStep = ref<HTMLElement>()
const userInput = ref<(MovieKey | null)[]>([])

const FINAL_STEP = 6

const selectedMovie = computed(() => {
  const [speed, element, temp, color, shape] = userInput.value.slice().reverse()
  return movieMap[shape as Shape][color as Color][temp as Temp][element as Element][speed as Speed]
})

function submit() {
  step.value++
  focusStep()
}

function focusStep() {
  setTimeout(() => {
    if (step.value === 6) {
      resultsStep.value?.focus()
    } else {
      quizStep.value?.focus()
    }
  })
}

function restart() {
  step.value = 0
  userInput.value = []
  focusStep()
}

function onChange(value: MovieKey) {
  userInput.value[step.value] = value
}
</script>
