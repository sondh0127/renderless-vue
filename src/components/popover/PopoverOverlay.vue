<script lang="ts" setup>
import { useId } from '../../hooks/use-id'
import { State, useOpenClosed } from '../../internal/open-closed'
import { PopoverStates, usePopoverContext } from './popover'

defineProps({
  as: { type: [Object, String], default: 'div' },
  static: { type: Boolean, default: false },
  unmount: { type: Boolean, default: true },
})

const api = usePopoverContext('PopoverOverlay')

const usesOpenClosedState = useOpenClosed()
const visible = computed(() => {
  if (usesOpenClosedState !== null) {
    return usesOpenClosedState.value === State.Open
  }

  return api.popoverState.value === PopoverStates.Open
})

function handleClick() {
  api.closePopover()
}

const slot = { open: api.popoverState.value === PopoverStates.Open }
const propsWeControl = {
  id: `headlessui-popover-overlay-${useId()}`,
  ref: 'el',
  'aria-hidden': true,
  onClick: handleClick,
}
</script>

<template>
  <div v-if="visible" v-bind="{ ...$props, ...propsWeControl }">
    <slot v-bind="slot"></slot>
  </div>
</template>
