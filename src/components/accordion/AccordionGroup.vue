<script lang="ts" setup>
import { useAccordionContext } from './context'

const { provide } = useAccordionContext()
provide()
</script>

<template>
  <slot></slot>
</template>
