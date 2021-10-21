<script lang="ts" setup>
import { Accordion, AccordionGroup } from '../components/accordion'

const isOpen = ref(false)
</script>

<template>
  <div>
    {{ isOpen }}
    <button @click="() => (isOpen = !isOpen)">Toggle from parent</button>
  </div>

  <Accordion v-model:isOpen="isOpen">
    <template #header="{ toggle }">
      <button @click="toggle">Squirrel 🐿️</button>
    </template>
    <template #default>
      <div>This is a text about Squirrels 🐿️</div>
    </template>
  </Accordion>
</template>
