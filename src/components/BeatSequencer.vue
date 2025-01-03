<template>
  <div class="p-2 flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div
        class="flex gap-2"
        v-for="(iconComponent, instrument) in instrumentIcons"
        :key="instrument"
      >
        <component :is="iconComponent" class="w-6 h-6" />
        <sequencer-note
          :aria-label="`${instrument} note ${note}`"
          v-for="note in 8"
          :key="instrument + note"
          :checked="notes[note - 1][instrument]"
          @change="notes[note - 1][instrument] = !notes[note - 1][instrument]"
        />
      </div>
    </div>
    <div class="flex gap-2 items-center">
      <IconMetronome class="w-8" />
      <div
        class="w-full h-2 relative overflow-hidden before:absolute before:w-full before:bottom-0 before:bg-dill-400 before:h-0.5"
      >
        <div
          class="w-0 h-0 absolute top-0 border-l-4 border-l-transparent border-r-transparent border-r-4 border-b-8 border-b-dill-400"
          :style="
            playing
              ? `animation: slide ${bpmToMilliseconds[selectedBpm] * 8}ms linear 0s infinite`
              : ''
          "
        ></div>
      </div>
    </div>
    <div class="flex gap-2 items-center justify-between">
      <jh-button @click="onPlaybackClick">{{ playing ? 'stop' : 'play' }}</jh-button>
      <div class="shrink-0 flex gap-1">
        bpm:
        <sequencer-bpm-radio
          v-for="bpm in bpmOptions"
          :key="bpm"
          @change="selectedBpm = bpm"
          :bpm
          :checked="selectedBpm === bpm"
        />
      </div>
      <div class="flex gap-2 items-center">
        <button
          class="w-5.5 h-5.5 border-1 rounded-xs border-transparent hover:border-dill-400 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dill-400"
          @click="shuffle"
        >
          <icon-shuffle class="w-full h-full" />
        </button>
        <button
          class="w-5.5 h-5.5 border-1 rounded-xs border-transparent hover:border-dill-400 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dill-400"
        >
          <icon-music-notes class="w-full h-full" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { sound } from '@pixi/sound'
import JhButton from '@/components/JhButton.vue'
import SequencerNote from '@/components/SequencerNote.vue'
import SequencerBpmRadio from '@/components/SequencerBpmRadio.vue'
import IconBassDrum from '@/components/icons/IconBassDrum.vue'
import IconSnareDrum from '@/components/icons/IconSnareDrum.vue'
import IconDrumClap from '@/components/icons/IconDrumClap.vue'
import IconMetronome from '@/components/icons/IconMetronome.vue'
import IconCymbal from '@/components/icons/IconCymbal.vue'
import IconMusicNotes from '@/components/icons/IconMusicNotes.vue'
import IconShuffle from '@/components/icons/IconShuffle.vue'

onMounted(() => {
  document.addEventListener('visibilitychange', stopSequencer)
  window.addEventListener('blur', stopSequencer)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', stopSequencer)
  window.removeEventListener('blur', stopSequencer)
})

const instruments = ['kick', 'snare', 'hat', 'clap'] as const
const bpmOptions = [100, 120, 140] as const
type BpmOption = (typeof bpmOptions)[number]
let beatInterval: number

const notes = ref<Array<Record<Instrument, boolean>>>(
  new Array(8).fill(null).map(() => ({
    kick: false,
    snare: false,
    hat: false,
    clap: false,
  })),
)

const selectedBpm = ref<BpmOption>(120)
const playing = ref<boolean>(false)

const instrumentIcons: Record<Instrument, typeof IconBassDrum> = {
  kick: IconBassDrum,
  snare: IconSnareDrum,
  hat: IconCymbal,
  clap: IconDrumClap,
}

const bpmToMilliseconds: Record<BpmOption, number> = {
  100: 300,
  120: 250,
  140: 214,
}

const bpmInMilliseconds = computed(() => bpmToMilliseconds[selectedBpm.value])

watch(selectedBpm, () => {
  restart()
})

function restart() {
  if (!playing.value) return
  stopSequencer()
  startSequencer()
}

function startSequencer() {
  let counter = 0
  beatInterval = setInterval(() => {
    if (counter >= 8) counter = 0
    instruments.forEach((instrument) => {
      if (notes.value[counter][instrument]) sound.play('my-sound', { sprite: instrument })
    })
    playing.value = true
    counter++
  }, bpmInMilliseconds.value)
}

function stopSequencer() {
  playing.value = false
  clearInterval(beatInterval)
}

function shuffle() {
  notes.value = premadeBeats[nextPremadeBeat]
  nextPremadeBeat = incrementOrLoop(nextPremadeBeat, premadeBeats.length - 1)
}

function incrementOrLoop(num: number, max: number) {
  return num + 1 > max ? 0 : num + 1
}

let nextPremadeBeat = 0
const premadeBeats = [
  [
    { kick: true, snare: false, hat: false, clap: false },
    { kick: false, snare: false, hat: true, clap: true },
    { kick: true, snare: true, hat: false, clap: false },
    { kick: false, snare: true, hat: false, clap: true },
    { kick: true, snare: false, hat: false, clap: false },
    { kick: false, snare: false, hat: true, clap: true },
    { kick: true, snare: true, hat: false, clap: true },
    { kick: false, snare: false, hat: true, clap: false },
  ],
  [
    { kick: true, snare: false, hat: false, clap: false },
    { kick: true, snare: false, hat: false, clap: true },
    { kick: false, snare: true, hat: false, clap: true },
    { kick: false, snare: false, hat: false, clap: false },
    { kick: true, snare: false, hat: false, clap: true },
    { kick: true, snare: false, hat: true, clap: true },
    { kick: false, snare: true, hat: true, clap: false },
    { kick: false, snare: true, hat: false, clap: true },
  ],
]

sound.add('my-sound', {
  url: '/sounds/drums.mp3',
  preload: true,
  sprites: {
    kick: { start: 0, end: 0.8 },
    snare: { start: 1, end: 1.8 },
    hat: { start: 2, end: 2.8 },
    clap: { start: 3, end: 3.8 },
  },
})

function onPlaybackClick() {
  if (playing.value) stopSequencer()
  else startSequencer()
}

export type Instrument = (typeof instruments)[number]
</script>

<style>
@keyframes slide {
  from {
    left: -4px;
  }
  to {
    left: calc(100% - 4px);
  }
}
</style>
