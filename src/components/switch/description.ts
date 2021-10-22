import {
  computed,
  defineComponent,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  unref,

  // Types
  ComputedRef,
  InjectionKey,
  Ref,
} from 'vue'

import { useId, render } from './helper'

// ---

const DescriptionContext = Symbol('DescriptionContext') as InjectionKey<{
  register(value: string): () => void
  slot: Ref<Record<string, any>>
  name: string
  props: Record<string, any>
}>

function useDescriptionContext() {
  const context = inject(DescriptionContext, null)
  if (context === null) {
    throw new Error('Missing parent')
  }
  return context
}

export function useDescriptions({
  slot = ref({}),
  name = 'Description',
  props = {},
}: {
  slot?: Ref<Record<string, unknown>>
  name?: string
  props?: Record<string, unknown>
} = {}): ComputedRef<string | undefined> {
  const descriptionIds = ref<string[]>([])

  function register(value: string) {
    descriptionIds.value.push(value)

    return () => {
      const idx = descriptionIds.value.indexOf(value)
      if (idx === -1) return
      descriptionIds.value.splice(idx, 1)
    }
  }

  provide(DescriptionContext, { register, slot, name, props })

  // The actual id's as string or undefined.
  return computed(() =>
    descriptionIds.value.length > 0 ? descriptionIds.value.join(' ') : undefined,
  )
}

// ---

export const Description = defineComponent({
  name: 'Description',
  props: {
    as: { type: [Object, String], default: 'p' },
  },
  setup() {
    const context = useDescriptionContext()
    const id = `headlessui-description-${useId()}`

    onMounted(() => onUnmounted(context.register(id)))

    return { id, context }
  },
  render() {
    const { name = 'Description', slot = ref({}), props = {} } = this.context
    const passThroughProps = this.$props
    const propsWeControl = {
      ...Object.entries(props).reduce(
        (acc, [key, value]) => Object.assign(acc, { [key]: unref(value) }),
        {},
      ),
      id: this.id,
    }

    return render({
      props: { ...passThroughProps, ...propsWeControl },
      slot: slot.value,
      attrs: this.$attrs,
      slots: this.$slots,
      name,
    })
  },
})
