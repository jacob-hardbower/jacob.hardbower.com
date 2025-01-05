<template>
  <div class="@container">
    <div class="px-4 pt-4 pb-3 @sm:pt-6 @sm:px-5">
      <div role="grid" class="grid grid-cols-14 w-full gap-x-2 mb-4 @sm:mb-6">
        <div class="grid grid-cols-1 col-span-2 gap-2 @sm:gap-3">
          <component
            :is="iconComponent"
            v-for="(iconComponent, instrument) in instrumentIcons"
            :key="instrument"
            class="w-6 h-6 self-center @sm:w-7 @sm:h-7"
          />
        </div>
        <div class="grid grid-cols-8 col-span-12 gap-2 @sm:gap-3">
          <template v-for="instrument in instruments">
            <sequencer-note
              class="self-center place-self-center w-full aspect-square"
              :active="activeNote === `${instrument}-${note}`"
              :label="`${instrument} note ${note}`"
              v-for="note in 8"
              :key="instrument + note"
              :checked="notes[note - 1][instrument]"
              @change="onNoteChange(instrument, note)"
              @up="activateNoteAbove(instrument, note)"
              @down="activateNoteBelow(instrument, note)"
              @left="activateNotePrevious(instrument, note)"
              @right="activateNoteNext(instrument, note)"
            />
          </template>
        </div>
        <div class="grid grid-cols-14 col-span-14 pt-3 @sm:pt-5">
          <IconMetronome class="col-span-2 @sm:w-8" />
          <div
            class="w-full place-self-center h-2 col-span-12 relative overflow-hidden before:absolute before:w-full before:bottom-0 before:bg-dill-400 before:h-0.5"
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
      </div>
      <div class="flex gap-2 items-center justify-between">
        <jh-button @click="onPlaybackClick">{{ playing ? 'stop' : 'play' }}</jh-button>
        <div class="shrink-0 flex gap-1 text-sm">
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
          <!-- <button
          class="w-5.5 h-5.5 border-1 rounded-xs border-transparent hover:border-dill-400 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dill-400"
        >
          <icon-music-notes class="w-full h-full" />
        </button> -->
        </div>
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

const activeNote = ref<string>(`${instruments[0]}-1`)

const notes = ref<Array<Record<Instrument, boolean>>>([
  { kick: true, snare: false, hat: false, clap: false },
  { kick: false, snare: false, hat: false, clap: false },
  { kick: true, snare: false, hat: false, clap: false },
  { kick: false, snare: false, hat: true, clap: false },
  { kick: true, snare: false, hat: false, clap: false },
  { kick: false, snare: false, hat: false, clap: true },
  { kick: true, snare: false, hat: false, clap: false },
  { kick: false, snare: false, hat: true, clap: false },
])

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
    // if (counter === 0) sound.play('bells', { sprite: 'clip' })
    // sound.speed('bells', 1.14)
    instruments.forEach((instrument) => {
      if (notes.value[counter][instrument]) sound.play('drums', { sprite: instrument })
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
  [
    { kick: true, snare: false, hat: true, clap: false },
    { kick: true, snare: false, hat: false, clap: false },
    { kick: false, snare: false, hat: true, clap: false },
    { kick: false, snare: false, hat: true, clap: false },
    { kick: false, snare: true, hat: false, clap: false },
    { kick: false, snare: false, hat: true, clap: false },
    { kick: false, snare: false, hat: false, clap: true },
    { kick: false, snare: false, hat: true, clap: true },
  ],
]

// sound.add('bells', {
//   url: '/sounds/bells.mp3',
//   preload: true,
//   sprites: {
//     clip: { start: 0, end: 4 },
//   },
// })

sound.add('drums', {
  url: '/sounds/drums.mp3',
  preload: true,
  sprites: {
    kick: { start: 0, end: 0.8 },
    snare: { start: 1, end: 1.8 },
    hat: { start: 2, end: 2.8 },
    clap: { start: 3, end: 3.8 },
  },
})

function onNoteChange(instrument: Instrument, note: number) {
  activeNote.value = `${instrument}-${note}`
  notes.value[note - 1][instrument] = !notes.value[note - 1][instrument]
}

function activateNoteAbove(instrument: Instrument, note: number) {
  if (instrument === instruments[0]) return
  const instrumentAbove = instruments[instruments.indexOf(instrument) - 1]
  activeNote.value = `${instrumentAbove}-${note}`
}

function activateNoteBelow(instrument: Instrument, note: number) {
  if (instrument === instruments[instruments.length - 1]) return
  const instrumentBelow = instruments[instruments.indexOf(instrument) + 1]
  activeNote.value = `${instrumentBelow}-${note}`
}

function activateNoteNext(instrument: Instrument, note: number) {
  if (note === 8) return
  activeNote.value = `${instrument}-${note + 1}`
}
function activateNotePrevious(instrument: Instrument, note: number) {
  if (note === 1) return
  activeNote.value = `${instrument}-${note - 1}`
}

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
