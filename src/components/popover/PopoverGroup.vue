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
import { PopoverGroupContext, PopoverRegisterBag } from './popover'

export default defineComponent({
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
</script>
