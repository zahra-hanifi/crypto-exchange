<template>
  <div class="flex flex-col gap-y-4">
    <div class="flex items-center justify-between">
      <h1 class="font-medium text-xl">Currencies List</h1>

      <input
        type="text"
        placeholder="Search"
        class="p-2 border border-gray-100 rounded"
        name="search"
        @input="debounceSearch($event.target.value)"
      />
    </div>

    <div v-if="loading" class="flex flex-col gap-y-4">
      <CSkeleton v-for="n in 10" :key="n" class="rounded w-full h-8" />
    </div>

    <CTable
      v-else-if="list.length"
      :items="list"
      :items-count="1000"
      :headers="headers"
      :search-model="search"
    >
      <template #name="{ item }">
        <div class="flex items-center gap-x-2">
          <nuxt-img :src="item.image" class="w-7 h-7" />

          <span class="text-gray-800 text-sm sm:text-base">
            {{ item.name }}
          </span>

          <span class="text-gray-400 text-xs sm:text-sm">
            {{ item.symbol.toUpperCase() }}
          </span>
        </div>
      </template>

      <template #price="{item}">
        <span class="text-gray-800 text-xs sm:text-sm">
          ${{ insertComma(item.current_price) }}
        </span>
      </template>

      <template #change="{item}">
        <span
          class="text-xs sm:text-sm"
          :class="getCoinChangeData(item.price_change_percentage_24h).color"
        >
          {{ getCoinChangeData(item.price_change_percentage_24h).value }}
        </span>
      </template>

      <template #details="{item}">
        <nuxt-link :to="`/coin/${item.id}`" class="text-gray-500">
          <CIcon :name="mdiChevronRight" />
        </nuxt-link>
      </template>

      <template #mobileCard="{ item }">
        <CoinMobileCard :item="item" />
      </template>
    </CTable>

    <div
      v-else
      class="my-4 text-center font-medium text-gray-500 text-base sm:text-lg"
    >
      Nothing found.
    </div>
  </div>
</template>

<script>
import { mdiChevronRight } from '@mdi/js'
import { insertComma, getCoinChangeData, debounce } from '@/utils/helpers'
import CTable from '~/components/shared/CTable.vue'
import CIcon from '@/components/shared/CIcon.vue'
import CoinMobileCard from '@/components/CoinMobileCard.vue'
import CSkeleton from '@/components/shared/CSkeleton.vue'

export default {
  name: 'HomePage',
  components: { CTable, CIcon, CoinMobileCard, CSkeleton },
  async asyncData({ store }) {
    await store.dispatch('coins/fetchCoins')
  },
  data() {
    return {
      mdiChevronRight,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Price', value: 'price' },
        { text: '24h %', value: 'change' },
        { text: '', value: 'details' }
      ],
      search: ''
    }
  },
  computed: {
    list() {
      const search = this.search.toLowerCase()
      const list = this.$store.state.coins.list

      if (!search) return list

      return list.filter((item) => {
        return (
          item.name.toLowerCase().includes(search) ||
          item.symbol.toLowerCase().includes(search)
        )
      })
    },
    loading() {
      return this.$store.state.coins.loading
    }
  },
  methods: {
    insertComma,
    getCoinChangeData,
    debounce,
    debounceSearch: debounce(function(value) {
      this.search = value
    })
  },
  head() {
    return { title: 'Crypto Exchange | Coins List' }
  }
}
</script>
