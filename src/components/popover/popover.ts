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

export enum PopoverStates {
  Open,
  Closed,
}

export interface StateDefinition {
  // State
  popoverState: Ref<PopoverStates>
  button: Ref<HTMLElement | null>
  buttonId: string
  panel: Ref<HTMLElement | null>
  panelId: string

  // State mutators
  togglePopover(): void
  closePopover(): void

  // Exposed functions
  close(focusableElement: HTMLElement | Ref<HTMLElement | null>): void
}

export const PopoverContext = Symbol('PopoverContext') as InjectionKey<StateDefinition>
export function usePopoverContext(component: string) {
  const context = inject(PopoverContext, null)
  if (context === null) {
    const err = new Error(`<${component} /> is missing a parent <${Popover.name} /> component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err, usePopoverContext)
    throw err
  }
  return context
}

const PopoverGroupContext = Symbol('PopoverGroupContext') as InjectionKey<{
  registerPopover(registerbag: PopoverRegisterBag): void
  unregisterPopover(registerbag: PopoverRegisterBag): void
  isFocusWithinPopoverGroup(): boolean
  closeOthers(buttonId: string): void
} | null>

export function usePopoverGroupContext() {
  return inject(PopoverGroupContext, null)
}

const PopoverPanelContext = Symbol('PopoverPanelContext') as InjectionKey<string | null>
export function usePopoverPanelContext() {
  return inject(PopoverPanelContext, null)
}

interface PopoverRegisterBag {
  buttonId: string
  panelId: string
  close(): void
}

export const PopoverOverlay = defineComponent({
  name: 'PopoverOverlay',
  props: {
    as: { type: [Object, String], default: 'div' },
    static: { type: Boolean, default: false },
    unmount: { type: Boolean, default: true },
  },
  setup() {
    const api = usePopoverContext('PopoverOverlay')

    const usesOpenClosedState = useOpenClosed()
    const visible = computed(() => {
      if (usesOpenClosedState !== null) {
        return usesOpenClosedState.value === State.Open
      }

      return api.popoverState.value === PopoverStates.Open
    })

    return {
      id: `headlessui-popover-overlay-${useId()}`,
      handleClick() {
        api.closePopover()
      },
      visible,
    }
  },
  render() {
    const api = usePopoverContext('PopoverOverlay')

    const slot = { open: api.popoverState.value === PopoverStates.Open }
    const propsWeControl = {
      id: this.id,
      ref: 'el',
      'aria-hidden': true,
      onClick: this.handleClick,
    }

    return render({
      props: { ...this.$props, ...propsWeControl },
      slot,
      attrs: this.$attrs,
      slots: this.$slots,
      features: Features.RenderStrategy | Features.Static,
      visible: this.visible,
      name: 'PopoverOverlay',
    })
  },
})

// ---

export const PopoverPanel = defineComponent({
  name: 'PopoverPanel',
  props: {
    as: { type: [Object, String], default: 'div' },
    static: { type: Boolean, default: false },
    unmount: { type: Boolean, default: true },
    focus: { type: Boolean, default: false },
  },
  setup(props) {
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

    return {
      id: api.panelId,
      el: api.panel,
      handleKeyDown(event: KeyboardEvent) {
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
      },
      visible,
    }
  },
  render() {
    const api = usePopoverContext('PopoverPanel')

    const slot = {
      open: api.popoverState.value === PopoverStates.Open,
      close: api.close,
    }

    const propsWeControl = {
      ref: 'el',
      id: this.id,
      onKeydown: this.handleKeyDown,
    }

    return render({
      props: { ...this.$props, ...propsWeControl },
      slot,
      attrs: this.$attrs,
      slots: this.$slots,
      features: Features.RenderStrategy | Features.Static,
      visible: this.visible,
      name: 'PopoverPanel',
    })
  },
})

// ---

export const PopoverGroup = defineComponent({
  name: 'PopoverGroup',
  props: {
    as: { type: [Object, String], default: 'div' },
  },
  setup() {
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

    return { el: groupRef }
  },
  render() {
    const propsWeControl = { ref: 'el' }

    return render({
      props: { ...this.$props, ...propsWeControl },
      slot: {},
      attrs: this.$attrs,
      slots: this.$slots,
      name: 'PopoverGroup',
    })
  },
})
