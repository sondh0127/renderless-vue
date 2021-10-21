<script lang="ts" setup>
import { Modal } from '../components/modal'

const modalRef = ref()
</script>

<template>
  <button
    class="border cursor-pointer bg-blue-200 border-gray-400 p-1 w-[100px] block focus:outline-none"
    @click="() => modalRef.openModal('TestModal')"
  >
    Rabbit 🐇
  </button>

  <Modal ref="modalRef" />
</template>
