<template>
  <div class="@container">
    <div class="px-4 pt-4 pb-3 @sm:px-5 @sm:pb-5">
      <div aria-hidden="true" class="text-dill-400 text-xs">> jacobs_movie_db.exe</div>
      <div class="mt-5">
        <movie-quiz-step v-if="step !== 6" ref="quizStep" :title="steps[step].title">
          <div>
            <p v-if="steps[step].body" class="mb-8 text-sm">
              {{ steps[step].body }}
            </p>
            <form class="flex flex-col items-start gap-3" @submit.prevent="submit">
              <jh-radio-button
                v-for="(option, index) in steps[step].options"
                :required="true"
                :key="option"
                :name="`quiz-${step}`"
                :checked="userInput[step] === steps[step].options?.[index].toLowerCase()"
                :label="steps[step].options?.[index]"
                @change="onChange(steps[step].options?.[index].toLowerCase() as MovieKey)"
              />
              <jh-button type="submit" class="mt-4">{{ steps[step].button }}</jh-button>
            </form>
          </div>
        </movie-quiz-step>
        <movie-quiz-step
          ref="resultsStep"
          v-else
          title="After countless calculations, we’ve selected a movie that matches your criteria."
        >
          <form @submit.prevent="restart">
            <article class="p-3.5 bg-dill-200">
              <div class="flex gap-2 items-baseline mb-2">
                <h4 class="font-display text-rot-600 text-2xl">{{ selectedMovie.name }}</h4>
                <div class="text-xs">({{ selectedMovie.year }})</div>
              </div>
              <div class="text-xs">{{ selectedMovie.description }}</div>
            </article>
            <jh-button type="submit" class="mt-8">start over</jh-button>
          </form>
        </movie-quiz-step>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MovieQuizStep from '@/components/MovieQuizStep.vue'
import JhRadioButton from '@/components/JhRadioButton.vue'
import JhButton from '@/components/JhButton.vue'

const step = ref<number>(0)
const quizStep = ref<HTMLElement>()
const resultsStep = ref<HTMLElement>()

const selectedMovie = computed(() => {
  const [speed, element, temp, color, shape] = userInput.value.slice().reverse()
  return movieMap[shape as Shape][color as Color][temp as Temp][element as Element][speed as Speed]
})

const userInput = ref<(MovieKey | null)[]>([])

interface Movie {
  name: string
  year: number
  description: string
}

const steps = [
  {
    title: ['Clear your next one to four hours...', "We're going to the movies!"],
    body: 'Take the quiz and allow me to hand-pick a flick that vibes with your selections!',
    button: 'start quiz',
  },
  {
    title: ['Through writing, direction, and performance, a shape begins to form.'],
    button: 'continue',
    options: ['Triangle', 'Circle'],
  },
  {
    title: ['Creative decisions, small details, and happy accidents provide color.'],
    button: 'continue',
    options: ['Blue', 'Orange'],
  },
  {
    title: ['Emotion, perspective, and presentation set a temperature for the narrative.'],
    button: 'continue',
    options: ['Hot', 'Cold'],
  },
  {
    title: ['Romance, humor, drama, and action are just a few of the elements.'],
    button: 'continue',
    options: ['Fire', 'Water'],
  },
  {
    title: ['Slow burn or roller coaster, pacing plays a crucial role.'],
    button: 'submit',
    options: ['Run', 'Walk'],
  },
]

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

const movieMap: Record<
  Shape,
  Record<Color, Record<Temp, Record<Element, Record<Speed, Movie>>>>
> = {
  triangle: {
    orange: {
      hot: {
        fire: {
          run: {
            name: 'Green Room',
            year: 2015,
            description:
              'A punk rock band is forced to fight for survival after playing a gig at a neo-Nazi skinhead bar.',
          },
          walk: {
            name: 'The Platform',
            year: 2019,
            description:
              'In a prison where inmates on higher floors eat better than those below, one man tries to bring change and justice.',
          },
        },
        water: {
          run: {
            name: 'Calm With Horses',
            year: 2019,
            description:
              'In rural Ireland, an ex-boxer becomes a feared enforcer for a criminal family while trying to be a good father.',
          },
          walk: {
            name: 'American History X',
            year: 1998,
            description:
              'A former neo-nazi skinhead tries to prevent his younger brother from going down the same wrong path that he did.',
          },
        },
      },
      cold: {
        fire: {
          run: {
            name: 'Prisoners',
            year: 2013,
            description:
              "When a man's daughter and her friend go missing, he takes matters into his own hands as the police pursue multiple leads.",
          },
          walk: {
            name: 'End of Watch',
            year: 2012,
            description:
              'Two young officers are marked for death after confiscating a small cache of money and firearms from the members of a notorious cartel.',
          },
        },
        water: {
          run: {
            name: 'The Lighthouse',
            year: 2019,
            description:
              'Two lighthouse keepers try to maintain their sanity while living on a remote and mysterious New England island in the 1890s.',
          },
          walk: {
            name: 'The Witch',
            year: 2015,
            description:
              'A family in 1630s New England is torn apart by the forces of witchcraft, black magic, and possession.',
          },
        },
      },
    },
    blue: {
      hot: {
        fire: {
          run: {
            name: 'V for Vendetta',
            year: 2005,
            description:
              'In a future British tyranny, a shadowy freedom fighter plots to overthrow it with the help of a young woman.',
          },
          walk: {
            name: 'Mad Max: Fury Road',
            year: 2015,
            description:
              'In a post-apocalyptic wasteland, Max teams up with Furiosa to escape a cult leader and his army in search of her homeland.',
          },
        },
        water: {
          run: {
            name: 'Uncut Gems',
            year: 2019,
            description:
              'A charismatic jeweler makes a high-stakes bet that could lead to the windfall of a lifetime.',
          },
          walk: {
            name: 'Schindler’s List',
            year: 1993,
            description:
              'In German-occupied Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
          },
        },
      },
      cold: {
        fire: {
          run: {
            name: 'Get Out',
            year: 2017,
            description:
              "A young man visits his girlfriend's parents for the weekend, where his simmering unease about their reception of him eventually reaches a boiling point.",
          },
          walk: {
            name: 'Sound of Metal',
            year: 2019,
            description:
              "A heavy-metal drummer's life is thrown into freefall when he begins to lose his hearing.",
          },
        },
        water: {
          run: {
            name: 'It Follows',
            year: 2014,
            description: 'A young woman is followed by an unknown supernatural force.',
          },
          walk: {
            name: 'Nightcrawler',
            year: 2014,
            description:
              'When Louis Bloom, a con man desperate for work, muscles into the world of L.A. crime journalism, he blurs the line between observer and participant.',
          },
        },
      },
    },
  },
  circle: {
    orange: {
      hot: {
        fire: {
          run: {
            name: 'There Will Be Blood',
            year: 2007,
            description:
              'A story of family, religion, hatred, oil, and madness, focusing on a turn-of-the-century prospector in the early days of the business.',
          },
          walk: {
            name: 'The Iron Claw',
            year: 2023,
            description:
              'The true story of the inseparable Von Erich brothers, who made history in the intensely competitive world of professional wrestling in the early 1980s.',
          },
        },
        water: {
          run: {
            name: 'In Bruges',
            year: 2008,
            description:
              'Guilt-stricken after a job gone wrong, hitman Ray and his partner await orders from their ruthless boss in Bruges, Belgium.',
          },
          walk: {
            name: 'A Girl Walks Home Alone at Night',
            year: 2014,
            description:
              'In the Iranian ghost-town Bad City, a place that reeks of death and loneliness, the townspeople are unaware they are being stalked by a lonesome vampire.',
          },
        },
      },
      cold: {
        fire: {
          run: {
            name: 'Lady Bird',
            year: 2017,
            description:
              'In 2002, an artistically inclined seventeen-year-old girl comes of age in Sacramento, California.',
          },
          walk: {
            name: 'The Virgin Suicides',
            year: 1999,
            description:
              'A group of male friends become obsessed with five mysterious sisters who are sheltered by their strict, religious parents in suburban Detroit in the mid-1970s.',
          },
        },
        water: {
          run: {
            name: 'Logan Lucky',
            year: 2017,
            description:
              'Two brothers attempt to pull off a heist during a NASCAR race in North Carolina.',
          },
          walk: {
            name: 'Bernie',
            year: 2011,
            description:
              'In small-town Texas, an affable mortician strikes up a friendship with a wealthy widow, but as she becomes controlling, he tries to separate himself from her grasp.',
          },
        },
      },
    },
    blue: {
      hot: {
        fire: {
          run: {
            name: 'Donnie Darko',
            year: 2001,
            description:
              'After narrowly escaping a bizarre accident, a troubled teenager is plagued by visions of a man in a large rabbit suit who manipulates him to commit a series of crimes.',
          },
          walk: {
            name: 'Zodiac',
            year: 2007,
            description:
              'In the late 1960s/early 1970s, a San Francisco cartoonist becomes an amateur detective obsessed with tracking down the Zodiac Killer.',
          },
        },
        water: {
          run: {
            name: 'Senna',
            year: 2010,
            description:
              'A documentary on Brazilian Formula One racing driver Ayrton Senna, who won the F1 world championship three times before his death at age 34.',
          },
          walk: {
            name: 'The Prestige',
            year: 2006,
            description:
              'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.',
          },
        },
      },
      cold: {
        fire: {
          run: {
            name: 'Knives Out',
            year: 2019,
            description:
              'A detective investigates the death of a patriarch of an eccentric, combative family.',
          },
          walk: {
            name: 'Glengarry Glen Ross',
            year: 1992,
            description:
              'An examination of the machinations behind the scenes at a real estate office.',
          },
        },
        water: {
          run: {
            name: 'The Founder',
            year: 2016,
            description:
              "The story of Ray Kroc, a salesman who turned two brothers' innovative fast food eatery, McDonald's, into one of the biggest restaurant businesses in the world.",
          },
          walk: {
            name: 'Man From Earth',
            year: 2007,
            description:
              'An impromptu goodbye party for Professor John Oldman becomes a mysterious interrogation after he reveals a stranger past than they can imagine.',
          },
        },
      },
    },
  },
}

type Shape = 'triangle' | 'circle'
type Color = 'orange' | 'blue'
type Temp = 'hot' | 'cold'
type Element = 'water' | 'fire'
type Speed = 'run' | 'walk'

type MovieKey = Shape | Color | Temp | Element | Speed
</script>
