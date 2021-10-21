<script lang="ts" setup>
import { Carousel } from '../components/carousel'

const items = ref(['Squirrel 🐿️', 'Rabbit 🐇', 'Hamster 🐹'])
</script>

<template>
  <p>Carousel</p>
  <Carousel :items="items">
    <template #default="{ payload, prev, next }">
      <div class="w-full max-w-[400px] inline-flex items-stretch">
        <button
          class="
            border
            cursor-pointer
            bg-blue-200
            border-gray-400
            p-1
            w-[100px]
            block
            focus:outline-none
          "
          type="button"
          @click="prev"
        >
          Previous
        </button>
        <span class="flex bg-gray-100 flex-1 items-center justify-center">{{ payload }}</span>
        <button
          class="
            border
            cursor-pointer
            bg-blue-200
            border-gray-400
            p-1
            w-[100px]
            block
            focus:outline-none
          "
          type="button"
          @click="next"
        >
          Next
        </button>
      </div>
    </template>
  </Carousel>
  <div class="h-4"></div>
  <p>Carousel (With loop)</p>
  <Carousel :items="items" loop>
    <template #default="{ payload, prev, next }">
      <div class="w-full max-w-[400px] inline-flex items-stretch">
        <button
          class="
            border
            cursor-pointer
            bg-blue-200
            border-gray-400
            p-1
            w-[100px]
            block
            focus:outline-none
          "
          type="button"
          @click="prev"
        >
          Previous
        </button>
        <span class="flex bg-gray-100 flex-1 items-center justify-center">{{ payload }}</span>
        <button
          class="
            border
            cursor-pointer
            bg-blue-200
            border-gray-400
            p-1
            w-[100px]
            block
            focus:outline-none
          "
          type="button"
          @click="next"
        >
          Next
        </button>
      </div>
    </template>
  </Carousel>
  <div class="h-4"></div>
  <p>Carousel (Set index)</p>
  <Carousel :items="items">
    <template #default="{ payload, setIndex, currentIndex }">
      <div class="h-10 w-full max-w-[400px] inline-flex items-stretch">
        <span class="flex bg-gray-100 flex-1 items-center justify-center">{{ payload }}</span>
      </div>
      <ul class="flex space-x-1 mt-2 max-w-[400px] items-center justify-center">
        <li v-for="(item, index) in items" :key="index">
          <button
            :class="[currentIndex === index ? 'bg-blue-200' : 'bg-gray-200']"
            class="
              border
              rounded-full
              cursor-pointer
              bg-blue-200
              border-gray-400
              h-[30px]
              p-0.5
              w-[30px]
              block
              focus:outline-none
            "
            @click="() => setIndex(index)"
          >
            {{ index + 1 }}
          </button>
        </li>
      </ul>
    </template>
  </Carousel>
</template>
