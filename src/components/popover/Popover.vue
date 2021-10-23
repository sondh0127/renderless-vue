<script lang="ts" setup>
import { useId } from '../../hooks/use-id'
import { dom } from '../../utils/dom'
import { useOpenClosedProvider, State, useOpenClosed } from '../../internal/open-closed'
import { useWindowEvent } from '../../hooks/use-window-event'
import { render } from '../../utils/render'
import {
  getFocusableElements,
  Focus,
  focusIn,
  FocusResult,
  isFocusableElement,
  FocusableMode,
} from '../../utils/focus-management'
import { StateDefinition, PopoverStates, PopoverContext, usePopoverGroupContext } from './popover'
import { match } from '../../utils/match'
import {
  // Types
  Ref,
  computed,
} from 'vue'

const props = defineProps({
  as: { type: [Object, String], default: 'div' },
})
const slots = useSlots()
const attrs = useAttrs()

const buttonId = `headlessui-popover-button-${useId()}`
const panelId = `headlessui-popover-panel-${useId()}`

const popoverState = ref<StateDefinition['popoverState']['value']>(PopoverStates.Closed)
const button = ref<StateDefinition['button']['value']>(null)
const panel = ref<StateDefinition['panel']['value']>(null)

const api = {
  popoverState,
  buttonId,
  panelId,
  panel,
  button,
  togglePopover() {
    popoverState.value = match(popoverState.value, {
      [PopoverStates.Open]: PopoverStates.Closed,
      [PopoverStates.Closed]: PopoverStates.Open,
    })
  },
  closePopover() {
    if (popoverState.value === PopoverStates.Closed) return
    popoverState.value = PopoverStates.Closed
  },
  close(focusableElement: HTMLElement | Ref<HTMLElement | null>) {
    api.closePopover()

    const restoreElement = (() => {
      if (!focusableElement) return dom(api.button)
      if (focusableElement instanceof HTMLElement) return focusableElement
      if (focusableElement.value instanceof HTMLElement) return dom(focusableElement)

      return dom(api.button)
    })()

    restoreElement?.focus()
  },
} as StateDefinition

provide(PopoverContext, api)
useOpenClosedProvider(
  computed(() =>
    match(popoverState.value, {
      [PopoverStates.Open]: State.Open,
      [PopoverStates.Closed]: State.Closed,
    }),
  ),
)

const registerBag = {
  buttonId,
  panelId,
  close() {
    api.closePopover()
  },
}

const groupContext = usePopoverGroupContext()
const registerPopover = groupContext?.registerPopover

function isFocusWithinPopoverGroup() {
  return (
    groupContext?.isFocusWithinPopoverGroup() ??
    (dom(button)?.contains(document.activeElement) || dom(panel)?.contains(document.activeElement))
  )
}

watchEffect(() => registerPopover?.(registerBag))

// Handle focus out
useWindowEvent(
  'focus',
  () => {
    if (popoverState.value !== PopoverStates.Open) return
    if (isFocusWithinPopoverGroup()) return
    if (!button.value) return
    if (!panel.value) return

    api.closePopover()
  },
  true,
)

// Handle outside click
useWindowEvent('mousedown', (event: MouseEvent) => {
  const target = event.target as HTMLElement

  if (popoverState.value !== PopoverStates.Open) return

  if (dom(button)?.contains(target)) return
  if (dom(panel)?.contains(target)) return

  api.closePopover()

  if (!isFocusableElement(target, FocusableMode.Loose)) {
    event.preventDefault()
    dom(button)?.focus()
  }
})

const open = computed(() => {
  return popoverState.value === PopoverStates.Open
})

// return () => {
//   const slot = { open: popoverState.value === PopoverStates.Open, close: api.close }
//   return render({ props, slot, slots, attrs, name: 'Popover' })
// }
</script>

<template>
  <div v-bind="$attrs">
    <slot :open="open" :close="api.close"></slot>
  </div>
</template>
