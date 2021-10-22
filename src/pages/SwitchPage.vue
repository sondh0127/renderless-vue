<script lang="ts" setup>
import { ref } from 'vue'
import { Switch, SwitchGroup, Label } from '../components/switch'

const enabled = ref(false)

onMounted(() => {
  console.log('[LOG] ~ file: Switch.vue ~ line 40 ~ onMounted')
})
</script>

<template>
  <div class="py-16">
    <Switch
      v-model="enabled"
      :class="enabled ? 'bg-teal-900' : 'bg-teal-700'"
      class="
        border-transparent
        rounded-full
        cursor-pointer
        border-2
        flex-shrink-0
        h-[38px]
        transition-colors
        ease-in-out
        w-[74px]
        duration-200
        relative
        inline-flex
        focus:outline-none
        focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-opacity-75
      "
    >
      <template #default="{ checked }">
        <span class="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          :class="enabled ? 'translate-x-9' : 'translate-x-0'"
          class="
            bg-white
            rounded-full
            h-[34px]
            shadow-lg
            transform
            transition
            ease-in-out
            ring-0
            w-[34px]
            duration-200
            pointer-events-none
            inline-block
          "
        ></span>
      </template>
    </Switch>

    <SwitchGroup>
      <div class="flex items-center">
        <Label class="mr-4">Enable notifications</Label>
        <Switch
          v-model="enabled"
          :class="enabled ? 'bg-blue-600' : 'bg-gray-200'"
          class="
            rounded-full
            h-6
            transition-colors
            w-11
            relative
            inline-flex
            items-center
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          "
        >
          <span
            :class="enabled ? 'translate-x-6' : 'translate-x-1'"
            class="bg-white rounded-full h-4 transform transition-transform w-4 inline-block"
          ></span>
        </Switch>
      </div>
    </SwitchGroup>
  </div>
</template>
