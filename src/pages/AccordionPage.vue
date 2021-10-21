<script lang="ts" setup>
import { Accordion, AccordionGroup } from '../components/accordion'

const isOpen = ref(false)
</script>

<template>
  <p>Accordion</p>
  <div class="pb-2">
    <button
      class="
        border
        cursor-pointer
        bg-red-200
        border-gray-400
        w-full
        max-w-[400px]
        p-2
        block
        focus:outline-none
      "
      @click="() => (isOpen = !isOpen)"
    >
      Toggle from parent {{ isOpen }}
    </button>
  </div>

  <Accordion v-model:isOpen="isOpen">
    <template #header="{ toggle }">
      <button
        class="
          border
          cursor-pointer
          bg-blue-200
          border-gray-400
          w-full
          max-w-[400px]
          p-2
          block
          focus:outline-none
        "
        @click="toggle"
      >
        Squirrel 🐿️
      </button>
    </template>
    <div class="border bg-blue-100 border-gray-500 border-t-0 mt-0 max-w-[400px] p-4">
      This is a text about Squirrels 🐿️
    </div>
  </Accordion>
  <hr class="my-4" />
  <p>AccordionGroup</p>
  <AccordionGroup>
    <Accordion>
      <template #header="{ toggle }">
        <button
          class="
            border
            cursor-pointer
            bg-gray-200
            border-gray-400
            w-full
            max-w-[400px]
            p-2
            block
            focus:outline-none
          "
          @click="toggle"
        >
          Squirrel 🐿️
        </button>
      </template>
      <div class="border bg-gray-100 border-gray-500 border-t-0 mt-0 max-w-[400px] p-4">
        This is a text about Squirrels 🐿️
      </div>
    </Accordion>

    <Accordion>
      <template #header="{ toggle }">
        <button
          class="
            border
            cursor-pointer
            bg-gray-200
            border-gray-400
            w-full
            max-w-[400px]
            p-2
            block
            focus:outline-none
          "
          @click="toggle"
        >
          Rabbit 🐇
        </button>
      </template>
      <div class="border bg-gray-100 border-gray-500 border-t-0 mt-0 max-w-[400px] p-4">
        This is a text about Rabbits 🐇
      </div>
    </Accordion>
    <Accordion>
      <template #header="{ toggle }">
        <button
          class="
            border
            cursor-pointer
            bg-gray-200
            border-gray-400
            w-full
            max-w-[400px]
            p-2
            block
            focus:outline-none
          "
          @click="toggle"
        >
          Hamster 🐹
        </button>
      </template>
      <div class="border bg-gray-100 border-gray-500 border-t-0 mt-0 max-w-[400px] p-4">
        This is a text about Hamsters 🐹
      </div>
    </Accordion>
  </AccordionGroup>
</template>
