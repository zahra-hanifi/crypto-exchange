export default (apiCaller) => ({
  getCoins(config) {
    return apiCaller.get('/coins/markets/', config)
  },
  getCoinDetails(id, config) {
    return apiCaller.get(`/coins/${id}/`, config)
  },
  getCoinChart(id, config) {
    return apiCaller.get(`/coins/${id}/market_chart/`, config)
  }
})
