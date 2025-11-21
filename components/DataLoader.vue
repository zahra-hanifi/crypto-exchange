<template>
  <div>
    <template v-if="loading">
      <CSkeleton class="rounded" :class="skeletonClass" />
    </template>
    <template v-else>
      <slot name="content"></slot>
    </template>
  </div>
</template>

<script>
import CSkeleton from '@/components/shared/CSkeleton.vue'

export default {
  name: 'DataLoader',
  components: { CSkeleton },
  props: {
    skeletonClass: { type: String, default: 'h-5 sm:h-6 w-20' },
    loading: { type: Boolean, default: false }
  }
}
</script>
