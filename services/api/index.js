import coins from '~/services/api/coins'

export default (apiCaller) => ({
  coins: coins(apiCaller)
})
