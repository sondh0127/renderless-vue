<script setup lang="ts">
import { STooltip } from '../components/tooltip'

const buttonRef = ref()
</script>

<template>
  <!-- <button v-tooltip="{ text: 'Squirrel' }">🐿️</button> -->
  <!-- <button v-tooltip="{{text: 'Rabbit'}}">🐇</button> -->
  <!-- <button v-tooltip="{{text: 'Hamster'}}">🐹</button> -->

  <!-- <Tooltip let:show let:dimensions>
    {#if show}
    <div
      class="tooltip"
      style="left: {dimensions.x + (dimensions.width / 2)}px; top: calc({dimensions.y}px - 2.75rem - 5px);"
    >
      <span>{show.text}</span>
    </div>
    {/if}
  </Tooltip> -->

  <STooltip :node="buttonRef">
    <template #default="{ show, dimensions }">
      <div v-if="show" class="tooltip">
        <!-- <span>{{ show.text }}</span> -->
        <span>Content</span>
        <span>{{ JSON.stringify(dimensions) }}</span>
      </div>
    </template>
  </STooltip>
  <button ref="buttonRef" class="bg-gray-200 h-[200px] w-[100px]">Button</button>
</template>
