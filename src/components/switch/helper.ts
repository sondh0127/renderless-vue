import { h, cloneVNode, Slots } from 'vue'

export function match<TValue extends string | number = string, TReturnValue = unknown>(
  value: TValue,
  lookup: Record<TValue, TReturnValue | ((...args: any[]) => TReturnValue)>,
  ...args: any[]
): TReturnValue {
  if (value in lookup) {
    const returnValue = lookup[value]
    return typeof returnValue === 'function' ? returnValue(...args) : returnValue
  }

  const error = new Error(
    `Tried to handle "${value}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      lookup,
    )
      .map((key) => `"${key}"`)
      .join(', ')}.`,
  )
  if (Error.captureStackTrace) Error.captureStackTrace(error, match)
  throw error
}

export enum Features {
  /** No features at all */
  None = 0,

  /**
   * When used, this will allow us to use one of the render strategies.
   *
   * **The render strategies are:**
   *    - **Unmount**   _(Will unmount the component.)_
   *    - **Hidden**    _(Will hide the component using the [hidden] attribute.)_
   */
  RenderStrategy = 1,

  /**
   * When used, this will allow the user of our component to be in control. This can be used when
   * you want to transition based on some state.
   */
  Static = 2,
}

export enum RenderStrategy {
  Unmount,
  Hidden,
}

export function render({
  visible = true,
  features = Features.None,
  ...main
}: {
  props: Record<string, any>
  slot: Record<string, any>
  attrs: Record<string, any>
  slots: Slots
  name: string
} & {
  features?: Features
  visible?: boolean
}) {
  // Visible always render

  if (visible) return _render(main)
  if (features & Features.Static) {
    // When the `static` prop is passed as `true`, then the user is in control, thus we don't care about anything else
    if (main.props.static) return _render(main)
  }

  if (features & Features.RenderStrategy) {
    const strategy = main.props.unmount ?? true ? RenderStrategy.Unmount : RenderStrategy.Hidden

    return match(strategy, {
      [RenderStrategy.Unmount]() {
        return null
      },
      [RenderStrategy.Hidden]() {
        return _render({
          ...main,
          props: { ...main.props, hidden: true, style: { display: 'none' } },
        })
      },
    })
  }

  // No features enabled, just render
  return _render(main)
}

function _render({
  props,
  attrs,
  slots,
  slot,
  name,
}: {
  props: Record<string, any>
  slot: Record<string, any>
  attrs: Record<string, any>
  slots: Slots
  name: string
}) {
  const { as, ...passThroughProps } = omit(props, ['unmount', 'static'])

  const children = slots.default?.(slot)
  if (as === 'template') {
    if (Object.keys(passThroughProps).length > 0 || Object.keys(attrs).length > 0) {
      const [firstChild, ...other] = children ?? []

      if (!isValidElement(firstChild) || other.length > 0) {
        throw new Error(
          [
            'Passing props on "template"!',
            '',
            `The current component <${name} /> is rendering a "template".`,
            `However we need to passthrough the following props:`,
            Object.keys(passThroughProps)
              .concat(Object.keys(attrs))
              .map((line) => `  - ${line}`)
              .join('\n'),
            '',
            'You can apply a few solutions:',
            [
              'Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".',
              'Render a single element as the child so that we can forward the props onto that element.',
            ]
              .map((line) => `  - ${line}`)
              .join('\n'),
          ].join('\n'),
        )
      }

      return cloneVNode(firstChild, passThroughProps as Record<string, any>)
    }

    if (Array.isArray(children) && children.length === 1) {
      return children[0]
    }

    return children
  }

  return h(as, passThroughProps, children)
}

export function omit<T extends Record<any, any>>(object: T, keysToOmit: string[] = []) {
  const clone = Object.assign({}, object)
  for (const key of keysToOmit) {
    if (key in clone) delete clone[key]
  }
  return clone
}

function isValidElement(input: any): boolean {
  if (input == null) return false // No children
  if (typeof input.type === 'string') return true // 'div', 'span', ...
  if (typeof input.type === 'object') return true // Other components
  if (typeof input.type === 'function') return true // Built-ins like Transition
  return false // Comments, strings, ...
}

// ===
let id = 0
function generateId() {
  return ++id
}

export function useId() {
  return generateId()
}

// ===

// TODO: This must already exist somewhere, right? 🤔
// Ref: https://www.w3.org/TR/uievents-key/#named-key-attribute-values
export enum Keys {
  Space = ' ',
  Enter = 'Enter',
  Escape = 'Escape',
  Backspace = 'Backspace',

  ArrowLeft = 'ArrowLeft',
  ArrowUp = 'ArrowUp',
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',

  Home = 'Home',
  End = 'End',

  PageUp = 'PageUp',
  PageDown = 'PageDown',

  Tab = 'Tab',
}

// ===
import { Ref } from 'vue'

export function dom<T extends HTMLElement>(ref?: Ref<T | null>): T | null {
  if (ref == null) return null
  if (ref.value == null) return null
  return ((ref as Ref<T & { $el: unknown }>).value.$el ?? ref.value) as T | null
}
