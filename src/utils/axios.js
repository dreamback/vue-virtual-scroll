
import axios from 'axios'

const http = axios.create({
  baseURL: '/',
  timeout: 1000 * 180,
  withCredentials: true
})

http.interceptors.request.use(config => {
  config.headers['Accept-Language'] = 'zh-CN'
  return config
}, error => {
  return Promise.reject(error)
})

http.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.reject(error)
})

export default http
