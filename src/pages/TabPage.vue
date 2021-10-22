<script setup lang="ts">
import { Tab, TabItem } from '../components/tab'

const enabledD = ref(false)
</script>

<template>
  <Tab>
    <template #tabs="{ tabs }">
      <div class="flex max-w-[400px] items-center justify-center">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :disabled="tab.disabled"
          :class="[tab.active ? 'bg-blue-200' : 'bg-gray-200']"
          class="
            border
            cursor-pointer
            border-gray-400
            w-full
            p-1
            block
            focus:outline-none
            disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-white
          "
          @click="tab.select"
        >
          {{ tab.props.title }}
        </button>
      </div>
    </template>
    <template #default="{ add, set, enable, disable }">
      <div class="border border-gray-400 border-t-0 max-w-[400px] p-4">
        <TabItem id="A" title="Squirrel 🐿️" active>
          <label> This is a text about Squirrels 🐿️ </label>
          <div class="flex items-center">
            <input v-model="enabledD" type="checkbox" />
            <span class="ml-2">Enable Dragon</span>
          </div>
        </TabItem>
        <TabItem id="B" title="Rabbit 🐇">
          <label> This is a text about Rabbits 🐇 </label>

          <button
            class="
              border
              rounded
              cursor-pointer
              border-gray-400
              p-0.5
              w-1/2
              block
              focus:outline-none
              disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-white
            "
            @click="() => set('A')"
          >
            Goto A
          </button>
        </TabItem>
        <TabItem id="C" title="Hamster 🐹">
          <label> This is a text about Hamsters 🐹 </label>
        </TabItem>
        <TabItem id="D" title="Dragon 🐉" :disabled="!enabledD"
          >This is a text about Dragon 🐉
        </TabItem>
      </div>
    </template>
  </Tab>
</template>
