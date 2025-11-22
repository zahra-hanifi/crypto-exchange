<template>
  <div :class="classes"></div>
</template>

<script>
export default {
  name: 'TSkeleton',
  props: {
    animation: {
      type: String,

      default: 'pulse',
      validator(value) {
        return ['pulse', 'moving-shadow'].includes(value)
      }
    }
  },
  computed: {
    classes() {
      const defaultClasses = 'bg-gray-100'
      let animationClass = ''
      switch (this.animation) {
        case 'moving-shadow':
          animationClass = 'animate-moving-shadow'
          break
        case 'pulse':
        default:
          animationClass = 'animate-pulse-opacity'
      }

      return [defaultClasses, animationClass]
    }
  }
}
</script>

<style scoped>
.animate-pulse-opacity {
  animation-duration: 1s;
}
.animate-moving-shadow {
  position: relative;
  overflow: hidden;
}
.animate-moving-shadow::after {
  display: block;
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translateX(-100%);
  animation: 1.5s moving-shadow linear 0.5s infinite;
  background: linear-gradient(
    -60deg,
    transparent 20%,
    rgb(131 131 131 / 13%) 50%,
    transparent 80%
  );
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  transform: translateX(-100%);
  z-index: 1;
}
.dark .animate-moving-shadow::after {
  background: linear-gradient(
    -60deg,
    transparent 20%,
    rgb(187 174 174 / 13%) 50%,
    transparent 80%
  );
}
</style>
