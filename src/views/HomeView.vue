<template>
  <nav
    class="relative pr-2 flex gap-1 items-center justify-end mb-2 -mt-2 max-w-107 mx-auto md:md:max-w-7xl md:mt-0 md:-mb-10 md:z-10 md:pr-4"
  >
    <router-link :to="{ name: 'blog' }" class="font-display pr-2">Blog</router-link>
    <a aria-label="LinkedIn" href="https://www.linkedin.com/in/jhardbower/"
      ><icon-linked-in class="w-5"
    /></a>
    <a aria-label="Github" href="https://github.com/jacob-hardbower"><icon-github class="w-5" /></a>
  </nav>
  <div
    class="relative flex flex-col gap-12 text-sm max-w-107 mx-auto md:max-w-7xl md:gap-20 lg:text-base lg:gap-28"
  >
    <header class="relative rounded-sm bg-dill-100 md:text-center">
      <h1 class="flex flex-col gap-y-2 px-6 py-4 md:py-12 md:gap-y-6">
        <span class="font-display text-rot-600 text-4xl md:text-6xl">Jacob Hardbower</span>
        <span>is a designer and developer of the web</span>
      </h1>
      <div class="bg-dill-800 p-2 flex gap-2 text-dill-200 text-xs rounded-b-sm md:justify-center">
        <icon-info class="w-3.5 h-3.5 shrink-0" />
        <div>I do a few other things in my spare time. What follows are a few descriptors.</div>
      </div>
    </header>

    <main class="flex flex-col gap-16 md:gap-28">
      <section
        v-for="(
          { name, description, img, imgAlt, component, componentDescription }, index
        ) in interests"
        :key="name"
        class="flex flex-col gap-12 items-center md:flex-row md:justify-center"
      >
        <div class="flex flex-col gap-6 lg:flex-row items-start lg:gap-8">
          <img
            :src="`/img/${img}`"
            :alt="imgAlt"
            class="rounded-4xl max-w-40"
            :class="rotations[index]"
          />
          <div class="flex flex-col gap-4 lg:pt-4 lg:max-w-86">
            <h2 class="font-display text-rot-600 text-4xl lg:text-6xl lg:w-60">
              {{ name }}
            </h2>
            <p v-for="paragraph in description" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </div>
        <div class="bg-dill-100 rounded-sm max-w-107 shrink-0">
          <component :is="component" />
          <div class="bg-dill-800 p-2 flex gap-2 text-dill-200 text-xs rounded-b-sm">
            <icon-info class="w-3.5 h-3.5 shrink-0" />
            <div>{{ componentDescription }}</div>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div
        class="relative flex flex-col gap-4 items-start border-2 border-dill-100 rounded-sm p-4 bg-dill-200 -mb-4 z-10"
      >
        <div>
          I’m a big fan of teaching and learning. I’ve written a few articles about front-end topics
          over on my blog.
        </div>
        <jh-button to="blog">go to blog</jh-button>
      </div>
      <div class="bg-dill-100 text-dill-400 font-display text-xl pt-8 pb-4 px-4 rounded-sm">
        That's all. Go outside!
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'unhead'
import RouteSetter from '@/components/RouteSetter.vue'
import BeatSequencer from '@/components/BeatSequencer.vue'
import DogCrossword from '@/components/DogCrossword.vue'
import MovieQuiz from '@/components/MovieQuiz.vue'
import JhButton from '@/components/JhButton.vue'
import IconInfo from '@/components/icons/IconInfo.vue'
import IconGithub from '@/components/icons/IconGithub.vue'
import IconLinkedIn from '@/components/icons/IconLinkedIn.vue'

useHead({
  title: 'Design & Development',
})

interface Interest {
  name: string
  description: Array<string>
  img: string
  imgAlt: string
  component: typeof RouteSetter
  componentDescription: string
}

const rotations = ['-rotate-4', 'rotate-6', '-rotate-4', 'rotate-4']

const interests: Array<Interest> = [
  {
    name: 'Rock Climber',
    description: [
      'What started as a curiosity 2019 has become a serious passion. I’ve gone as far as to build a wall in my garage!',
      'The problem-solving nature of climbing is addictive, and the community around it is a treasure.',
    ],
    img: 'wall.webp',
    imgAlt: 'Monochrome photo of climbing holds on a climbing wall.',
    component: RouteSetter,
    componentDescription:
      'Route-setting is the art of creating problems at varying degrees of difficulty. Try your hand at crafting a route!',
  },
  {
    name: 'Beat Maker',
    description: [
      'In awe of and inspired by amazing musicians like Röyksopp, Justice, Air, and Portishead, I’ve always had a soft spot for electronic music.',
      'After years of mediocrity with a guitar, I’ve recently begun a journey into digital beat making, and I’m already in love.',
    ],
    img: 'midi.webp',
    imgAlt: 'Monochrome photo of two midi keyboards and a groovebox.',
    component: BeatSequencer,
    componentDescription:
      'Sequence a drum track by selecting notes on the grid. Change the BPM to give it a different feel. Press mute or clear to stop playback.',
  },
  {
    name: 'Dog Wrangler',
    description: [
      'We adopted our first sausage dog in college, which is why he’s so well educated in melting our hearts.',
      'Life is better with two dogs, so we picked up a second wiener. She has taken well to her role of emotional support dog to her brother.',
    ],
    img: 'dogs.webp',
    imgAlt: 'Monochrome photo of two dachshunds.',
    component: DogCrossword,
    componentDescription: 'Take your shot at figuring out the names of our two rambunctious pups.',
  },
  {
    name: 'Movie Enjoyer',
    description: [
      'I’m always looking for a good recommendation and I’m always willing to give one!',
      'While my tastes have evolved over the years, I can find something of interest in just about any movie.',
    ],
    img: 'vhs.webp',
    imgAlt: 'Monochrome photo of VHS sleeves.',
    component: MovieQuiz,
    componentDescription:
      'Given the less-than-scientific nature of this quiz, your enjoyment may vary. (I don’t collect this data, so don’t expect me to remember it!)',
  },
]
</script>
