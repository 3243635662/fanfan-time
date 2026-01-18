import { $notification } from '@/hooks/useNotification';
// src/api/request.ts
import axios from 'axios'
import { STORAGE_KEYS, APP_PREFIX } from '@/utils/constants'
import { storeToRefs } from 'pinia'

const instance = axios.create({
  baseURL: import.meta.env.VITE_GLOB_API_URL || '',
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'foobar',

  }
})

// 请求拦截器：运行时再去读 store
instance.interceptors.request.use(async (config) => {
  console.log('发送请求:', config.url);

  // 运行时动态获取最新 token
  const { useAuthStore } = await import('@/store/auth') // 动态导入，避免循环依赖
  const { token } = storeToRefs(useAuthStore())

  const storedToken = localStorage.getItem(`${APP_PREFIX}:${STORAGE_KEYS.TOKEN}`)
  const finalToken = token.value || storedToken
  console.log('finalToken:', finalToken)
  if (finalToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${finalToken}`
  }

  // Mock 处理逻辑保持不变...
  return config
}, (error) => {
  console.error('请求错误:', error)
  return Promise.reject(error)
})

// 响应拦截器同理，403 时动态导入 store
instance.interceptors.response.use(async (response) => {
  console.log('收到响应:', response.data)
  return response.data
}, async (error) => {
  if (error.response?.status === 403) {
    // 运行时动态导入，避免循环依赖
    const { useAuthStore } = await import('@/store/auth')
    $notification.error({
      title: '身份失效',
      content: '您的身份已过期，请重新登录',
    })
    useAuthStore().logout() // 统一走 store 的 logout
  }
  return Promise.reject(error)
})

export default instance
