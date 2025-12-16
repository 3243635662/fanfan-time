// 此模块配置API请求
import axios from 'axios'

// 创建axios实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_GLOB_API_URL || '',
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'foobar'
  }
})

// 添加请求拦截器
instance.interceptors.request.use((config) => {
  console.log('发送请求:', config.url);
  // 如果启用了Mock且没有配置baseURL，确保URL以/api开头
  if (import.meta.env.VITE_USE_MOCK === 'true' && !import.meta.env.VITE_GLOB_API_URL) {
    if (config.url && !config.url.startsWith('/api')) {
      config.url = `/api${config.url}`
    }
  }
  
  return config
}, (error) => {
  console.error('请求错误:', error);
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use((response) => {
  console.log('收到响应:', response.data);
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data
}, (error) => {
  console.error('响应错误:', error);
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么

  return Promise.reject(error)
})
export default instance
