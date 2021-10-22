import { h, ref, defineComponent, reactive } from 'vue'
import { RenderableComponent, ResizeObserverOptions, useElementBounding } from '@vueuse/core'

export const UseElementBounding = defineComponent<ResizeObserverOptions & RenderableComponent>({
  name: 'UseElementBounding',
  props: ['box', 'as'] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const data = reactive(useElementBounding(target, { box: props.box, window: props.window }))

    return () => {
      if (slots.default) return h(props.as || 'div', { ref: target }, slots.default(data))
    }
  },
})
