<template>
  <div class="w-full py-2">
    <nuxt-link :to="`/coin/${item.id}`" class="flex flex-col gap-y-4 flex-wrap">
      <div class="flex items-center gap-x-2 w-full">
        <nuxt-img :src="item.image" class="w-7 h-7" />

        <span class="text-gray-800 text-sm truncate">
          {{ item.name }}
        </span>

        <span class="text-gray-400 text-xs truncate">
          {{ item.symbol.toUpperCase() }}
        </span>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-x-1">
          <span class="text-xs text-gray-700">Current Price:</span>

          <span class="text-gray-800 text-sm font-medium">
            ${{ insertComma(item.current_price) }}
          </span>
        </div>

        <span
          class="text-xs"
          :class="
            coinChangesData.color === 'green'
              ? 'text-green-500'
              : coinChangesData.color === 'red'
              ? 'text-red-500'
              : 'text-gray-500'
          "
        >
          {{ coinChangesData.value }}
        </span>
      </div>
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
  computed: {
    coinChangesData() {
      if (!this.item) return { value: '', color: '' }

      return this.getCoinChangeData(this.item.price_change_percentage_24h)
    }
  },
  methods: {
    insertComma,
    getCoinChangeData
  }
}
</script>
