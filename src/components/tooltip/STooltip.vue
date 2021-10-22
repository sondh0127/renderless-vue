<script lang="ts" setup>
const show = ref(true)
const dimensions = ref({})

const props = defineProps<{ node: HTMLElement }>()

watchEffect(() => {
  console.log('[LOG] ~ file: STooltip.vue ~ line 6 ~ props', props)
})

// const scroll = (ev) => {
//   let dim = props.node.getBoundingClientRect()

//   dimensions.value = {
//     x: dim.x,
//     y: dim.y,
//     width: dim.width,
//     height: dim.height,
//     bottom: dim.bottom + window.scrollY,
//     left: dim.bottom + window.scrollX,
//     right: dim.right + window.scrollX,
//     top: dim.top + window.scrollX,
//   }
// }

const mouseover = () => {
  debugger
  // document.addEventListener('scroll', scroll)

  // show.value = true
  // let dim = props.node.getBoundingClientRect()

  // dimensions.value = {
  //   x: dim.x,
  //   y: dim.y,
  //   width: dim.width,
  //   height: dim.height,
  //   bottom: dim.bottom,
  //   left: dim.bottom,
  //   right: dim.right,
  //   top: dim.top,
  // }
}

// const mouseout = () => {
//   document.addEventListener('scroll', scroll)

//   show.value = false
// }

onMounted(() => {
  // props.node.addEventListener('mouseover', mouseover)
})
// props.node.addEventListener('mouseout', mouseout)

// const tooltip = (node, opts) => {
//   let _opts = opts

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
</script>

<template>
  <slot :show="show" :dimensions="dimensions"></slot>
  <slot name="trigger"></slot>
</template>
