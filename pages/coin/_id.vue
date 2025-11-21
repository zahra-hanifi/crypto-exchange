<template>
  <div
    class="bg-white rounded-xl p-4 sm:p-7 overflow-y-auto w-full h-full card flex flex-col gap-y-8"
  >
    <h1 class="font-medium text-xl">Currency Details</h1>

    <div class="flex flex-col gap-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-x-4 sm:gap-x-5">
          <DataLoader
            :loading="loading"
            skeleton-class="w-8 sm:w-10 h-8 sm:h-10 rounded-full"
          >
            <template #content>
              <nuxt-img
                :src="data.image.small"
                class="w-8 sm:w-10 h-8 sm:h-10"
              />
            </template>
          </DataLoader>

          <div class="flex flex-col gap-y-0.5">
            <DataLoader :loading="loading">
              <template #content>
                <span v-if="data" class="font-medium text-sm sm:text-base">
                  {{ data.name }}
                </span>
              </template>
            </DataLoader>

            <DataLoader :loading="loading">
              <template #content>
                <span
                  v-if="data"
                  class="font-medium text-gray-500 text-xs sm:text-sm"
                >
                  {{ data.symbol.toUpperCase() }}
                </span>
              </template>
            </DataLoader>
          </div>
        </div>

        <DataLoader :loading="loading" skeleton-class="w-14 h-5 sm:h-6">
          <template #content>
            <span
              v-if="data"
              class="font-medium text-sm sm:text-base"
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
          </template>
        </DataLoader>
      </div>

      <hr class="my-3" />

      <div
        v-for="(item, label) in marketData"
        :key="label"
        class="flex justify-between"
      >
        <span class="text-gray-500 text-xs sm:text-sm">{{ label }}</span>

        <DataLoader :loading="loading" skeletonClass="h-5 sm:h-6 w-32 rounded">
          <template #content>
            <span class="text-sm sm:text-base text-gray-900 font-medium">
              ${{ insertComma(item) }}
            </span>
          </template>
        </DataLoader>
      </div>

      <hr class="my-3" />

      <CTabs v-model="selectedTab" :tabs="tabs" />

      <template v-if="selectedTab === 'description'">
        <DataLoader :loading="loading" skeleton-class="w-full h-52">
          <template #content>
            <p class="text-gray-500 text-sm leading-6">
              {{ data.description.en || 'Nothing found.' }}
            </p>
          </template>
        </DataLoader>
      </template>

      <DataLoader
        v-if="selectedTab === 'chart'"
        :loading="loadingChart"
        skeleton-class="w-full h-52"
      >
        <template #content>
          <CoinPriceChart
            v-if="coinPriceChangesData"
            :data="coinPriceChangesData"
          />
        </template>
      </DataLoader>
    </div>
  </div>
</template>

<script>
import CoinPriceChart from '@/components/CoinPriceChart.vue'
import CTabs from '@/components/shared/CTabs.vue'
import DataLoader from '@/components/DataLoader.vue'
import {
  capitalizeFirstLetter,
  insertComma,
  getCoinChangeData
} from '@/utils/helpers'

export default {
  name: 'CoinDetails',
  components: { CoinPriceChart, CTabs, DataLoader },
  async asyncData({ store, route }) {
    const { data } = await store.dispatch(
      'coins/fetchCoinDetails',
      route.params.id
    )

    return { data }
  },
  data() {
    return {
      coinPriceChangesData: null,
      selectedTab: 'description',
      tabs: [
        {
          value: 'description',
          label: 'Description'
        },
        {
          value: 'chart',
          label: 'Chart'
        }
      ],
      loadingChart: false
    }
  },
  computed: {
    coinChangesData() {
      if (!this.data) return { value: '', color: '' }

      return this.getCoinChangeData(
        this.data.market_data.price_change_percentage_24h
      )
    },
    coinId() {
      return this.$route.params.id
    },
    marketData() {
      return {
        'Current Price': this.data?.market_data.current_price.usd,
        'Total Volume': this.data?.market_data.total_volume.usd,
        'Market Cap': this.data?.market_data.market_cap.usd
      }
    },
    loading() {
      return this.$store.state.coins.detailLoading
    }
  },
  mounted() {
    this.getCoinChart()
  },
  methods: {
    insertComma,
    getCoinChangeData,
    getCoinChart() {
      this.loadingChart = true
      const config = {
        params: {
          vs_currency: 'usd',
          days: '7'
        }
      }
      this.$api.coins
        .getCoinChart(this.coinId, config)
        .then((response) => {
          this.coinPriceChangesData = response.data.prices
        })
        .finally(() => {
          this.loadingChart = false
        })
    }
  },
  head() {
    return {
      title: `Crypto Exchange | ${capitalizeFirstLetter(this.coinId)} Details`
    }
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
</style>
