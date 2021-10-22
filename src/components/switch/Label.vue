<script lang="ts">
import { useId, render } from './helper'
import { useLabelContext } from './label'
import { onMounted } from 'vue'

export default defineComponent({
  name: 'Label2',
  props: {
    as: { type: [Object, String], default: 'label' },
    passive: { type: [Boolean], default: false },
  },
  setup() {
    const context = useLabelContext()
    const id = `headlessui-label-${useId()}`
    onMounted(() => onUnmounted(context.register(id)))

    return { id, context }
  },
  render() {
    const { name = 'Label2', slot = {}, props = {} } = this.context
    const { passive, ...passThroughProps } = this.$props
    const propsWeControl = {
      ...Object.entries(props).reduce(
        (acc, [key, value]) => Object.assign(acc, { [key]: unref(value) }),
        {},
      ),
      id: this.id,
    }
    const allProps = { ...passThroughProps, ...propsWeControl }

    // @ts-expect-error props are dynamic via context, some components will
    //                  provide an onClick then we can delete it.
    if (passive) delete allProps['onClick']

    return render({
      props: allProps,
      slot,
      attrs: this.$attrs,
      slots: this.$slots,
      name,
    })
  },
})
</script>
