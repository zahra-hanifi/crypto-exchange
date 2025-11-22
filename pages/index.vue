<template>
  <div
    ref="wrapper"
    class="bg-white rounded-xl p-4 overflow-y-auto w-full h-full flex flex-col gap-y-4 card"
  >
    <div class="flex items-center justify-between gap-3 flex-wrap">
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
      <CSkeleton v-for="n in 10" :key="n" class="rounded w-full h-20 sm:h-8" />
    </div>

    <template v-else-if="list.length">
      <CTable
        :items="lazyItems"
        :items-count="list.length"
        :items-per-page="list.length"
        :headers="headers"
        :search-model="search"
        class="hidden sm:block"
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
            :class="
              changePercentage(item).color === 'green'
                ? 'text-green-500'
                : changePercentage(item).color === 'red'
                ? 'text-red-500'
                : 'text-gray-500'
            "
          >
            {{ changePercentage(item).value }}
          </span>
        </template>

        <template #details="{item}">
          <nuxt-link :to="`/coin/${item.id}`" class="text-gray-500">
            <CIcon :name="mdiChevronRight" />
          </nuxt-link>
        </template>
      </CTable>

      <div class="sm:hidden divide-y divide-gray-100">
        <CoinMobileCard
          v-for="item in lazyItems"
          :key="item.symbol"
          :item="item"
        />
      </div>
    </template>

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
      search: '',
      items: [],
      shownCount: 20
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
    },
    lazyItems() {
      if (this.search.trim() === '')
        return this.items.length ? this.items : this.list?.slice(0, 20)
      else return this.list
    }
  },
  mounted() {
    this.items = this.list.slice(0, 20)

    this.$watch('list', () => {
      this.items = this.list.slice(0, 20)
    })

    const wrapper = this.$refs.wrapper
    if (wrapper) {
      wrapper.addEventListener('scroll', () => {
        if (wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight) {
          this.loadMore()
        }
      })
    }
  },
  methods: {
    insertComma,
    getCoinChangeData,
    debounce,
    debounceSearch: debounce(function(value) {
      this.search = value
    }),
    loadMore() {
      for (let i = this.shownCount; i < this.shownCount + 20; i++) {
        if (this.list[i]) {
          this.items.push(this.list[i])
        }
      }
      this.shownCount = this.shownCount + 20
    },
    changePercentage(item) {
      return this.getCoinChangeData(item.price_change_percentage_24h)
    }
  },
  head() {
    return { title: 'Crypto Exchange | Coins List' }
  }
}
</script>

<style scoped>
@media (min-width: 640px) {
  .card {
    height: 600px;
    width: 700px;
  }
}

@media (max-width: 640px) {
  .card {
    height: calc(100vh - 61px - 32px);
  }
}
</style>
