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

export const PopoverGroupContext = Symbol('PopoverGroupContext') as InjectionKey<{
  registerPopover(registerbag: PopoverRegisterBag): void
  unregisterPopover(registerbag: PopoverRegisterBag): void
  isFocusWithinPopoverGroup(): boolean
  closeOthers(buttonId: string): void
} | null>

export function usePopoverGroupContext() {
  return inject(PopoverGroupContext, null)
}

export const PopoverPanelContext = Symbol('PopoverPanelContext') as InjectionKey<string | null>
export function usePopoverPanelContext() {
  return inject(PopoverPanelContext, null)
}

export interface PopoverRegisterBag {
  buttonId: string
  panelId: string
  close(): void
}
