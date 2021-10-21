<script setup lang="ts">
const isOpen = ref(false)
const payload = ref({ component: undefined, props: {} })
const closePromise = ref()

const openModal = (component, props = {}) => {
  isOpen.value = true
  payload.value = { component, props }
  return new Promise((resolve) => {
    closePromise.value = resolve
  })
}

const closeModal = (response) => {
  isOpen.value = false
  if (typeof closePromise.value === 'function') {
    closePromise.value(response ?? payload.value)
  }
}

/**
 * create Modal using new Vue instance
 */

// let instance: any
// return (options: ModalOptions) => {
//   if (instance) {
//     instance.service(options)
//     return instance
//   }
//   const div = document.createElement('div')
//   document.body.appendChild(div)
//   const app = createApp(Modal, { options })
//   instance = app.mount(div)
//   return instance
// }
</script>

<template>
  <component :is="payload.component" v-if="isOpen" v-bind="payload.props" :close="closeModal" />
</template>
