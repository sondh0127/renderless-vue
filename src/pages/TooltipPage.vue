<!-- <script lang="ts">
export default defineComponent({
  directives: {
    tooltip: VueTooltip,
  },
})
</script> -->
<script setup lang="ts">
import { STooltip } from '../components/tooltip'
</script>

<template>
  <!-- <button v-tooltip="{{text: 'Squirrel'}}">🐿️</button>
  <button v-tooltip="{{text: 'Rabbit'}}">🐇</button>
  <button v-tooltip="{{text: 'Hamster'}}">🐹</button> -->

  <!-- <Tooltip let:options let:dimensions>
    {#if options}
    <div
      class="tooltip"
      style="left: {dimensions.x + (dimensions.width / 2)}px; top: calc({dimensions.y}px - 2.75rem - 5px);"
    >
      <span>{options.text}</span>
    </div>
    {/if}
  </Tooltip> -->

  <STooltip>
    <template #trigger="{ options }">
      {{ options }}
      <button>Button</button>
    </template>

    <!-- <template #trigger>
    </template> -->
  </STooltip>
</template>
