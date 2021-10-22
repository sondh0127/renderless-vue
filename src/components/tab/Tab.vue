<script setup lang="ts">
import { useTabContext } from './context'

const { provide, tabs, add, set, enable, disable } = useTabContext()
provide()
</script>

<template>
  <slot name="tabs" :tabs="tabs"></slot>
  <slot :add="add" :set="set" :enable="enable" :disable="disable"></slot>
</template>
