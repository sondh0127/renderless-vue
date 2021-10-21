<script setup lang="ts">
interface Props {
  close: () => void
}
const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
  <div
    class="
      rounded
      bg-gray-300
      min-h-[250px] min-w-[250px]
      p-4
      transform
      top-1/2
      left-1/2
      shadow-light-500
      -translate-x-1/2 -translate-y-1/2
      fixed
    "
  >
    <button
      class="
        border
        rounded-full
        cursor-pointer
        bg-red-200
        border-gray-400
        h-[30px]
        p-0.5
        top-1
        right-1
        w-[30px]
        block
        absolute
        focus:outline-none
      "
      @click="props.close"
    >
      &times;
    </button>
    <div>Modal Content</div>
  </div>
</template>
