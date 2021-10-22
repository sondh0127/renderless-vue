<script lang="ts" setup>
import { GroupContext } from './context'
import { Keys } from './helper'

const props = withDefaults(defineProps<{ modelValue: boolean }>(), {
  modelValue: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', _value: boolean): void
}>()

const api = inject(GroupContext, null)
console.log('[LOG] ~ file: Switch.vue ~ line 14 ~ api', api)

function toggle() {
  emit('update:modelValue', !props.modelValue)
}

const internalSwitchRef = ref(null)
const switchRef = api === null ? internalSwitchRef : api.switchRef
const labelledby = computed(() => (api === null ? undefined : api.labelledby.value))

function handleClick(event: MouseEvent) {
  event.preventDefault()
  toggle()
}

function handleKeyUp(event: KeyboardEvent) {
  if (event.key !== Keys.Tab) event.preventDefault()
  if (event.key === Keys.Space) toggle()
}

// This is needed so that we can "cancel" the click event when we use the `Enter` key on a button.
function handleKeyPress(event: KeyboardEvent) {
  event.preventDefault()
}
</script>

<template>
  <button
    ref="switchRef"
    role="switch"
    type="button"
    tabindex="0"
    :aria-labelledby="labelledby"
    @click="handleClick"
    @keyup="handleKeyUp"
    @keypress="handleKeyPress"
  >
    <slot :checked="$props.modelValue"></slot>
    {{ labelledby }}
  </button>
</template>
