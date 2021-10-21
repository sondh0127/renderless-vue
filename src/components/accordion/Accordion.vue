<script lang="ts" setup>
import { useAccordionContext } from './context'
const props = withDefaults(defineProps<{ isOpen?: boolean }>(), { isOpen: false })
const emit = defineEmits(['update:isOpen'])
const isOpen = useVModel(props, 'isOpen', emit)
const _isOpen = ref(false)

const stop = biSyncRef(isOpen, _isOpen)

const close = () => (_isOpen.value = false)
const toggle = () => {
  _isOpen.value = !_isOpen.value
}

const { inject } = useAccordionContext()
const context = inject()
const setCurrent = context && context.setCurrent

watchEffect(() => {
  _isOpen.value && setCurrent && setCurrent(close)
})
</script>

<template>
  <slot name="header" :toggle="toggle" :isOpen="_isOpen"></slot>
  <slot v-if="_isOpen"></slot>
</template>
