<script setup lang="ts">
import AccordionPage from './pages/AccordionPage.vue'
import CarouselPage from './pages/CarouselPage.vue'
import ModalPage from './pages/ModalPage.vue'
import TabPage from './pages/TabPage.vue'
import TooltipPage from './pages/TooltipPage.vue'
</script>

<template>
  <div class="flex flex-col space-y-10">
    <div>
      <AccordionPage />
    </div>
    <div>
      <CarouselPage />
    </div>
    <div>
      <ModalPage />
    </div>
    <div>
      <TabPage />
    </div>
    <div>
      <TooltipPage />
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 60px;
}
</style>
