<script lang="ts" setup>
import { render, Features } from '../../utils/render'
import { useId } from '../../hooks/use-id'
import { Keys } from '../../utils/keyboard'
import {
  getFocusableElements,
  Focus,
  focusIn,
  FocusResult,
  isFocusableElement,
  FocusableMode,
} from '../../utils/focus-management'
import { dom } from '../../utils/dom'
import { useWindowEvent } from '../../hooks/use-window-event'
import { useOpenClosedProvider, State, useOpenClosed } from '../../internal/open-closed'
import { useResolveButtonType } from '../switch/use-resolve-button-type'
import { PopoverPanelContext, PopoverStates, usePopoverContext } from './popover'

const props = defineProps({
  static: { type: Boolean, default: false },
  unmount: { type: Boolean, default: true },
  focus: { type: Boolean, default: false },
})

const { focus } = props
const api = usePopoverContext('PopoverPanel')

provide(PopoverPanelContext, api.panelId)

onUnmounted(() => {
  api.panel.value = null
})

// Move focus within panel
watchEffect(() => {
  if (!focus) return
  if (api.popoverState.value !== PopoverStates.Open) return
  if (!api.panel) return

  const activeElement = document.activeElement as HTMLElement
  if (dom(api.panel)?.contains(activeElement)) return // Already focused within Dialog

  focusIn(dom(api.panel)!, Focus.First)
})

// Handle Tab / Shift+Tab focus positioning
useWindowEvent('keydown', (event: KeyboardEvent) => {
  if (api.popoverState.value !== PopoverStates.Open) return
  if (!dom(api.panel)) return

  if (event.key !== Keys.Tab) return
  if (!document.activeElement) return
  if (!dom(api.panel)?.contains(document.activeElement)) return

  // We will take-over the default tab behaviour so that we have a bit
  // control over what is focused next. It will behave exactly the same,
  // but it will also "fix" some issues based on whether you are using a
  // Portal or not.
  event.preventDefault()

  const result = focusIn(dom(api.panel)!, event.shiftKey ? Focus.Previous : Focus.Next)

  if (result === FocusResult.Underflow) {
    return dom(api.button)?.focus()
  } else if (result === FocusResult.Overflow) {
    if (!dom(api.button)) return

    const elements = getFocusableElements()
    const buttonIdx = elements.indexOf(dom(api.button)!)

    const nextElements = elements
      .splice(buttonIdx + 1) // Elements after button
      .filter((element) => !dom(api.panel)?.contains(element)) // Ignore items in panel

    // Try to focus the next element, however it could fail if we are in a
    // Portal that happens to be the very last one in the DOM. In that
    // case we would Error (because nothing after the button is
    // focusable). Therefore we will try and focus the very first item in
    // the document.body.
    if (focusIn(nextElements, Focus.First) === FocusResult.Error) {
      focusIn(document.body, Focus.First)
    }
  }
})

// Handle focus out when we are in special "focus" mode
useWindowEvent(
  'focus',
  () => {
    if (!focus) return
    if (api.popoverState.value !== PopoverStates.Open) return
    if (!dom(api.panel)) return
    if (dom(api.panel)?.contains(document.activeElement as HTMLElement)) return
    api.closePopover()
  },
  true,
)

const usesOpenClosedState = useOpenClosed()
const visible = computed(() => {
  if (usesOpenClosedState !== null) {
    return usesOpenClosedState.value === State.Open
  }

  return api.popoverState.value === PopoverStates.Open
})

const slot = {
  open: api.popoverState.value === PopoverStates.Open,
  close: api.close,
}

function handleKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case Keys.Escape:
      if (api.popoverState.value !== PopoverStates.Open) return
      if (!dom(api.panel)) return
      if (!dom(api.panel)?.contains(document.activeElement)) return
      event.preventDefault()
      api.closePopover()
      dom(api.button)?.focus()
      break
  }
}

const propsWeControl = {
  id: api.panelId,
  onKeydown: handleKeyDown,
}
</script>
<template>
  <div v-if="visible" ref="api.panel" v-bind="{ ...$props, ...propsWeControl }">
    <slot v-bind="slot"></slot>
  </div>
</template>
