<template>
  <div class="flex items-center gap-x-4">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      class="text-sm sm:text-base text-gray-700"
      :class="{ 'border-b-2 border-yellow-400': model === tab.value }"
      @click="select(tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script>
import vModel from '@/mixins/vModel'

export default {
  name: 'CTabs',
  mixins: [vModel],
  props: {
    tabs: { type: Array, required: true }
  },
  methods: {
    select(value) {
      this.model = value
      this.$emit('onTabChange')
    }
  }
}
</script>
