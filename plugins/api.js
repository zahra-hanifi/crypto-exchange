import axios from 'axios'
import createApi from '~/services/api/index.js'

const apiPromisesCache = new Map()

const addTrailingAndLeadingSlashToUrl = (url) => {
  if (/^(?!https?:).*/.test(url) && !url.startsWith('/')) url = '/' + url
  if (!url.endsWith('/')) url = url + '/'
  return url
}

const setDefaultConfigs = (config) => {
  config.instance = config.instance || 'default'
  config.params = config.params || null
  return config
}

export const apiCaller = (apiCallerInstances) => ({
  get(url, config = {}) {
    config = setDefaultConfigs(config)
    const apiCallerInstance = apiCallerInstances[config.instance]
    if (config.instance === 'default') {
      url = addTrailingAndLeadingSlashToUrl(url)
    }

    const key = url + (config.params ? JSON.stringify(config.params) : '')

    if (apiPromisesCache.has(key)) {
      return apiPromisesCache.get(key)
    }

    const promise = apiCallerInstance.get(url, config)
    apiPromisesCache.set(key, promise)

    promise.finally(() => {
      apiPromisesCache.delete(key)
    })

    return promise
  },
  post(url, config = {}) {
    config = setDefaultConfigs(config)
    const apiCallerInstance = apiCallerInstances[config.instance]
    if (config.instance === 'default') {
      url = addTrailingAndLeadingSlashToUrl(url)
    }
    return apiCallerInstance.post(url, config.data, config)
  },
  put(url, config = {}) {
    config = setDefaultConfigs(config)
    const apiCallerInstance = apiCallerInstances[config.instance]
    if (config.instance === 'default') {
      url = addTrailingAndLeadingSlashToUrl(url)
    }
    return apiCallerInstance.put(url, config.data, config)
  },
  patch(url, config = {}) {
    config = setDefaultConfigs(config)
    const apiCallerInstance = apiCallerInstances[config.instance]
    if (config.instance === 'default') {
      url = addTrailingAndLeadingSlashToUrl(url)
    }
    return apiCallerInstance.patch(url, config.data, config)
  },
  delete(url, config = {}) {
    config = setDefaultConfigs(config)
    const apiCallerInstance = apiCallerInstances[config.instance]
    if (config.instance === 'default') {
      url = addTrailingAndLeadingSlashToUrl(url)
    }
    return apiCallerInstance.delete(url, config)
  }
})

export default function({ $axios, $config }, inject) {
  const generalAxiosInstance = axios.create()

  const axiosInstances = {
    default: $axios,
    general: generalAxiosInstance
  }

  Object.values(axiosInstances).forEach((instance) => {
    instance.interceptors.response.use()
  })

  inject('api', createApi(apiCaller(axiosInstances)))
}
