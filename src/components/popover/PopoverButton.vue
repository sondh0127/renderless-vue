<script lang="ts">
import {
  defineComponent,
  inject,
  onUnmounted,
  provide,
  ref,
  watchEffect,

  // Types
  InjectionKey,
  Ref,
  computed,
} from 'vue'

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
import {
  PopoverStates,
  usePopoverContext,
  usePopoverGroupContext,
  usePopoverPanelContext,
} from './popover'

export default defineComponent({
  name: 'PopoverButton',
  props: {
    as: { type: [Object, String], default: 'button' },
    disabled: { type: [Boolean], default: false },
  },
  setup(props, { attrs }) {
    const api = usePopoverContext('PopoverButton')

    const groupContext = usePopoverGroupContext()
    const closeOthers = groupContext?.closeOthers

    const panelContext = usePopoverPanelContext()
    const isWithinPanel = panelContext === null ? false : panelContext === api.panelId

    // TODO: Revisit when handling Tab/Shift+Tab when using Portal's
    const activeElementRef = ref<Element | null>(null)
    const previousActiveElementRef = ref<Element | null>(
      typeof window === 'undefined' ? null : document.activeElement,
    )

    function handleClick() {
      if (props.disabled) return
      if (isWithinPanel) {
        api.closePopover()
        dom(api.button)?.focus() // Re-focus the original opening Button
      } else {
        if (api.popoverState.value === PopoverStates.Closed) closeOthers?.(api.buttonId)
        dom(api.button)?.focus()
        api.togglePopover()
      }
    }

    useWindowEvent(
      'focus',
      () => {
        previousActiveElementRef.value = activeElementRef.value
        activeElementRef.value = document.activeElement
      },
      true,
    )

    const elementRef = ref(null)

    if (!isWithinPanel) {
      watchEffect(() => {
        api.button.value = elementRef.value
      })
    }

    const isHovered = useElementHover(elementRef)

    watch(isHovered, (newValue) => {
      if (newValue) {
        handleClick()
      }
    })

    const open = computed(() => {
      return api.popoverState.value === PopoverStates.Open
    })

    const slot = { open: api.popoverState.value === PopoverStates.Open }

    const type = useResolveButtonType(
      computed(() => ({ as: props.as, type: attrs.type })),
      elementRef,
    )

    function handleKeyDown(event: KeyboardEvent) {
      if (isWithinPanel) {
        if (api.popoverState.value === PopoverStates.Closed) return
        switch (event.key) {
          case Keys.Space:
          case Keys.Enter:
            event.preventDefault() // Prevent triggering a *click* event
            event.stopPropagation()
            api.closePopover()
            dom(api.button)?.focus() // Re-focus the original opening Button
            break
        }
      } else {
        switch (event.key) {
          case Keys.Space:
          case Keys.Enter:
            event.preventDefault() // Prevent triggering a *click* event
            event.stopPropagation()
            if (api.popoverState.value === PopoverStates.Closed) closeOthers?.(api.buttonId)
            api.togglePopover()
            break

          case Keys.Escape:
            if (api.popoverState.value !== PopoverStates.Open) return closeOthers?.(api.buttonId)
            if (!dom(api.button)) return
            if (!dom(api.button)?.contains(document.activeElement)) return
            api.closePopover()
            break

          case Keys.Tab:
            if (api.popoverState.value !== PopoverStates.Open) return
            if (!api.panel) return
            if (!api.button) return

            // TODO: Revisit when handling Tab/Shift+Tab when using Portal's
            if (event.shiftKey) {
              // Check if the last focused element exists, and check that it is not inside button or panel itself
              if (!previousActiveElementRef.value) return
              if (dom(api.button)?.contains(previousActiveElementRef.value)) return
              if (dom(api.panel)?.contains(previousActiveElementRef.value)) return

              // Check if the last focused element is *after* the button in the DOM
              const focusableElements = getFocusableElements()
              const previousIdx = focusableElements.indexOf(
                previousActiveElementRef.value as HTMLElement,
              )
              const buttonIdx = focusableElements.indexOf(dom(api.button)!)
              if (buttonIdx > previousIdx) return

              event.preventDefault()
              event.stopPropagation()

              focusIn(dom(api.panel)!, Focus.Last)
            } else {
              event.preventDefault()
              event.stopPropagation()

              focusIn(dom(api.panel)!, Focus.First)
            }

            break
        }
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (isWithinPanel) return
      if (event.key === Keys.Space) {
        // Required for firefox, event.preventDefault() in handleKeyDown for
        // the Space key doesn't cancel the handleKeyUp, which in turn
        // triggers a *click*.
        event.preventDefault()
      }
      if (api.popoverState.value !== PopoverStates.Open) return
      if (!api.panel) return
      if (!api.button) return

      // TODO: Revisit when handling Tab/Shift+Tab when using Portal's
      switch (event.key) {
        case Keys.Tab:
          // Check if the last focused element exists, and check that it is not inside button or panel itself
          if (!previousActiveElementRef.value) return
          if (dom(api.button)?.contains(previousActiveElementRef.value)) return
          if (dom(api.panel)?.contains(previousActiveElementRef.value)) return

          // Check if the last focused element is *after* the button in the DOM
          const focusableElements = getFocusableElements()
          const previousIdx = focusableElements.indexOf(
            previousActiveElementRef.value as HTMLElement,
          )
          const buttonIdx = focusableElements.indexOf(dom(api.button)!)
          if (buttonIdx > previousIdx) return

          event.preventDefault()
          event.stopPropagation()
          focusIn(dom(api.panel)!, Focus.Last)
          break
      }
    }

    const propsWeControl = isWithinPanel
      ? {
          ...props,
          ref: 'el',
          type: type,
          onKeydown: handleKeyDown,
          onClick: handleClick,
        }
      : {
          ...props,
          ref: 'el',
          id: api.buttonId,
          type: type,
          'aria-expanded': props.disabled
            ? undefined
            : api.popoverState.value === PopoverStates.Open,
          'aria-controls': dom(api.panel) ? api.panelId : undefined,
          disabled: props.disabled ? true : undefined,
          onKeydown: handleKeyDown,
          onKeyup: handleKeyUp,
          onClick: handleClick,
        }

    return {
      open,
      isWithinPanel,
      el: elementRef,
      type,
      handleKeyDown,
      handleKeyUp,
      handleClick,
      propsWeControl,
    }
  },
})
</script>
<template>
  <button v-bind="propsWeControl">
    <slot :open="open"></slot>
  </button>
</template>
