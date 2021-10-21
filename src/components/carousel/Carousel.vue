<script setup lang="ts">
interface Props {
  items: string[]
  currentIndex?: number
  loop?: boolean
  setIndex?: (val: number) => boolean
  prev?: () => void
  next?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  currentIndex: 0,
  loop: false,
})
const emit = defineEmits(['update:currentIndex'])

const currentIndex = useVModel(props, 'currentIndex', emit)
const _currentIndex = ref(0)

const stop = biSyncRef(_currentIndex, currentIndex)

const setIndex = (val: number) => val < props.items.length && (_currentIndex.value = val)

const next = props.next
  ? props.next
  : () => {
      return (_currentIndex.value =
        _currentIndex.value < props.items.length - 1
          ? _currentIndex.value + 1
          : props.loop
          ? 0
          : props.items.length - 1)
    }

const prev = props.prev
  ? props.prev
  : () =>
      (_currentIndex.value =
        _currentIndex.value != 0
          ? _currentIndex.value - 1
          : props.loop
          ? props.items.length - 1
          : 0)

const payload = computed(() => props.items[_currentIndex.value])
</script>

<template>
  <slot
    :currentIndex="_currentIndex"
    :payload="payload"
    :setIndex="setIndex"
    :prev="prev"
    :next="next"
    :loop="loop"
  ></slot>
</template>
