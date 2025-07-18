import axios from 'axios'
import { isRunning } from '../consts/config'

const apiClient = axios.create()

//NOTE: Add an interceptor to attach a cache-busting param to all requests when isRunning is true
apiClient.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    v: Math.floor(Date.now() / 100),
  }
  return config
})

export default apiClient

