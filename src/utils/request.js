import axios from 'axios'
import { useUserStore } from '@/stores/user'
import router from '@/router/index.js'
import { ElMessage } from 'element-plus'

const request = axios.create({
  // baseURL: "http://127.0.0.1:8080",
  baseURL: '/api',
  timeout: 30000,
})

// 请求拦截器 - 携带Token
request.interceptors.request.use(
  (config) => {
    //从Pinia store中获取JWT令牌
    const userStore = useUserStore()
    const token = userStore.token

    //除了登录请求，其他请求都添加token
    if (token && config.url !== '/login') {
      config.headers.token = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器 - 直接返回data
request.interceptors.response.use(
  (response) => {
    console.log(response)
    return response.data
  },
  (error) => {
    console.log(error)
    if (error.response.status === 401) {
      //跳转到登录页面
      ElMessage.error('登录已过期，请重新登录')
      router.push('/login')
    } else ElMessage.error(error.response.data.message)
    return Promise.reject(error)
  },
)

export default request
