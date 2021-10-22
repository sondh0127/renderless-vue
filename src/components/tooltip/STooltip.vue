<script lang="ts" setup>
const options = ref(false)
// const dimensions = ref({})

const slots = useSlots()
const isMounted = ref(false)

// onMounted(() => {
//   isMounted.value = true
//   console.log(
//     '[LOG] ~ file: STooltip.vue ~ line 6 ~ slots',
//     slots.trigger()[0]?.el?.getBoundingClientRect(),
//   )
// })

// watchEffect(() => {
//   // let dim = slots.trigger()[0].el.getBoundingClientRect()
//   // console.log('[LOG] ~ file: STooltip.vue ~ line 12 ~ dim', dim)
// })
// const tooltip = (node, opts) => {
//   let _opts = opts

//   const mouseover = () => {
//     document.addEventListener('scroll', scroll)

//     options.set(_opts)
//     let dim = node.getBoundingClientRect()

//     dimensions.set({
//       x: dim.x,
//       y: dim.y,
//       width: dim.width,
//       height: dim.height,
//       bottom: dim.bottom,
//       left: dim.bottom,
//       right: dim.right,
//       top: dim.top,
//     })
//   }

//   const mouseout = () => {
//     document.addEventListener('scroll', scroll)

//     options.set(false)
//   }

//   const scroll = (ev) => {
//     let dim = node.getBoundingClientRect()

//     dimensions.set({
//       x: dim.x,
//       y: dim.y,
//       width: dim.width,
//       height: dim.height,
//       bottom: dim.bottom + window.scrollY,
//       left: dim.bottom + window.scrollX,
//       right: dim.right + window.scrollX,
//       top: dim.top + window.scrollX,
//     })
//   }

//   node.addEventListener('mouseover', mouseover)
//   node.addEventListener('mouseout', mouseout)

//   return {
//     destroy() {
//       node.removeEventListener('mouseover', mouseover)
//       node.removeEventListener('mouseout', mouseout)
//     },
//     update(opts) {
//       _opts = opts
//     },
//   }
// }

// defineExpose({
//   tooltip,
// })
</script>

<template>
  <!-- <slot v-if="isMounted" name="trigger" :options="options" :dimensions="dimensions"></slot> -->
  <slot name="trigger" :options="options"></slot>
</template>
