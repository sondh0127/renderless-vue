import {
  computed,
  inject,
  provide,
  ref,

  // Types
  ComputedRef,
  InjectionKey,
} from 'vue'

// ---

const LabelContext: InjectionKey<{
  register(value: string): () => void
  slot: Record<string, unknown>
  name: string
  props: Record<string, unknown>
}> = Symbol('LabelContext')

export function useLabelContext() {
  const context = inject(LabelContext, null)
  if (context === null) {
    const err = new Error('You used a <Label /> component, but it is not inside a parent.')
    if (Error.captureStackTrace) Error.captureStackTrace(err, useLabelContext)
    throw err
  }
  return context
}

export function useLabels({
  slot = {},
  name = 'Label',
  props = {},
}: {
  slot?: Record<string, unknown>
  name?: string
  props?: Record<string, unknown>
} = {}): ComputedRef<string | undefined> {
  const labelIds = ref<string[]>([])
  function register(value: string) {
    labelIds.value.push(value)

    return () => {
      const idx = labelIds.value.indexOf(value)
      if (idx === -1) return
      labelIds.value.splice(idx, 1)
    }
  }

  provide(LabelContext, { register, slot, name, props })

  // The actual id's as string or undefined.
  return computed(() => (labelIds.value.length > 0 ? labelIds.value.join(' ') : undefined))
}
