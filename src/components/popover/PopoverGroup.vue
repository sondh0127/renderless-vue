<script lang="ts" setup>
import { dom } from '../../utils/dom'
import { PopoverGroupContext, PopoverRegisterBag } from './popover'

defineProps({
  as: { type: [Object, String], default: 'div' },
})

const groupRef = ref<HTMLElement | null>(null)
const popovers = ref<PopoverRegisterBag[]>([])

function unregisterPopover(registerBag: PopoverRegisterBag) {
  const idx = popovers.value.indexOf(registerBag)
  if (idx !== -1) popovers.value.splice(idx, 1)
}

function registerPopover(registerBag: PopoverRegisterBag) {
  popovers.value.push(registerBag)
  return () => {
    unregisterPopover(registerBag)
  }
}

function isFocusWithinPopoverGroup() {
  const element = document.activeElement as HTMLElement

  if (dom(groupRef)?.contains(element)) return true

  // Check if the focus is in one of the button or panel elements. This is important in case you are rendering inside a Portal.
  return popovers.value.some((bag) => {
    return (
      document.getElementById(bag.buttonId)?.contains(element) ||
      document.getElementById(bag.panelId)?.contains(element)
    )
  })
}

function closeOthers(buttonId: string) {
  for (const popover of popovers.value) {
    if (popover.buttonId !== buttonId) popover.close()
  }
}

provide(PopoverGroupContext, {
  registerPopover,
  unregisterPopover,
  isFocusWithinPopoverGroup,
  closeOthers,
})
</script>
<template>
  <div ref="groupRef" v-bind="$props">
    <slot></slot>
  </div>
</template>
