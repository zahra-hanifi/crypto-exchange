<template>
  <svg
    class="inline-block"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :class="{ spin: spin }"
    :style="`min-width: ${size}px; min-height: ${size}px`"
    @click="$emit('click')"
    @mouseover="$emit('mouseover')"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <path :d="name" />
  </svg>
</template>

<script>
export default {
  name: 'CIcon',
  props: {
    name: { type: String, required: true },
    size: {
      type: [Number, String],
      default: 20,
      validator(value) {
        return !isNaN(value)
      }
    },
    spin: { type: Boolean, default: false }
  }
}
</script>

<style scoped>
path {
  fill: currentColor;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
