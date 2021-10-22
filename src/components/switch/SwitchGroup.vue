<script lang="ts" setup>
import { useDescriptions, useLabels } from './index'
import { GroupContext, StateDefinition } from './context'

const switchRef = ref<StateDefinition['switchRef']['value']>(null)

const labelledby = useLabels({
  name: 'Label',
  props: {
    onClick() {
      if (!switchRef.value) return
      switchRef.value.click()
      switchRef.value.focus({ preventScroll: true })
    },
  },
})

const describedby = useDescriptions({ name: 'SwitchDescription' })

provide(GroupContext, { switchRef, labelledby, describedby })
</script>

<template>
  <slot></slot>
</template>
