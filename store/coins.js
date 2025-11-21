export const state = () => ({
  list: [],
  page: 1,
  perPage: 20,
  loading: false,
  detailLoading: false
})

export const mutations = {
  setList(state, payload) {
    state.list = payload
  },
  setLoading(state, payload) {
    state.loading = payload
  },
  setDetailLoading(state, payload) {
    state.detailLoading = payload
  }
}

export const actions = {
  async fetchCoins({ commit }) {
    commit('setLoading', true)
    const config = {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        page: 1,
        per_page: 20
      }
    }
    try {
      const response = await this.$api.coins.getCoins(config)
      commit('setList', response.data)
    } catch (error) {
      console.log(`Coins list error: ${error}`)
    } finally {
      commit('setLoading', false)
    }
  },
  async fetchCoinDetails({ commit }, id) {
    commit('setDetailLoading', true)
    try {
      return await this.$api.coins.getCoinDetails(id)
    } catch (error) {
      console.log(`Coin details error: ${error}`)
    } finally {
      commit('setDetailLoading', false)
    }
  }
}
