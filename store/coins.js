export const state = () => ({
  list: [],
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
        order: 'market_cap_desc'
      }
    }
    try {
      const response = await this.$api.coins.getCoins(config)
      commit('setList', response.data)
    } catch {
      commit('setList', [])
    } finally {
      commit('setLoading', false)
    }
  },
  async fetchCoinDetails({ commit }, id) {
    commit('setDetailLoading', true)
    try {
      const response = await this.$api.coins.getCoinDetails(id)
      return response.data
    } finally {
      commit('setDetailLoading', false)
    }
  }
}
