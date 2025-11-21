<template>
  <div>
    <nuxt-link
      :to="`/coin/${item.id}`"
      class="flex items-center justify-between gap-x-2"
    >
      <div class="flex items-center gap-x-2">
        <nuxt-img :src="item.image" class="w-7 h-7" />

        <span class="text-gray-800 text-sm truncate">
          {{ item.name }}
        </span>

        <span class="text-gray-400 text-xs truncate">
          {{ item.symbol.toUpperCase() }}
        </span>
      </div>

      <span class="text-gray-800 text-xs">
        ${{ insertComma(item.current_price) }}
      </span>

      <span
        class="text-xs sm:text-sm"
        :class="getCoinChangeData(item.price_change_percentage_24h).color"
      >
        {{ getCoinChangeData(item.price_change_percentage_24h).value }}
      </span>
    </nuxt-link>
  </div>
</template>

<script>
import { insertComma, getCoinChangeData } from '@/utils/helpers'

export default {
  name: 'CoinMobileCard',
  props: {
    item: { type: Object, required: true }
  },
  methods: {
    insertComma,
    getCoinChangeData
  }
}
</script>
