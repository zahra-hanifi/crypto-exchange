<template>
  <div class="sm:h-screen overflow-y-hidden">
    <header class="p-4 border-b border-gray-200">
      <nuxt-link to="/" class="text-xl font-bold">Crypto Exchange</nuxt-link>
    </header>

    <div
      class="p-4 sm:py-8 bg-gray-100 flex items-center justify-center card-container"
    >
      <div class="bg-white rounded-xl p-4 overflow-y-auto w-full h-full card">
        <nuxt />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  min-height: calc(100vh - 61px);
}

@media (min-width: 640px) {
  .card {
    height: 600px;
    width: 700px;
  }
}
</style>
<script setup lang="ts"></script>
