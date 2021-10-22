<script setup lang="ts">
import { useTabContext } from './context'

interface Props {
  id: string
  active?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  disabled: false,
})

const _active = ref(props.active)

const { inject } = useTabContext()

const { add, set, disable, enable } = inject()

const select = () => {
  console.log('[LOG] ~ file: TabItem.vue ~ line 27 ~ props.id', props.id)
  set(props.id)
}
const setState = (state: boolean) => (_active.value = state)

const attr = useAttrs()

onMounted(() => {
  add({
    id: props.id,
    setState,
    active: _active.value,
    disabled: props.disabled,
    select,
    props: attr,
  })
})

watchEffect(() => {
  props.disabled ? disable(props.id) : enable(props.id)
})
</script>

<template>
  <slot v-if="_active"></slot>
</template>
