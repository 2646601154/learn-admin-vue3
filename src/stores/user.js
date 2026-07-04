import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

//用户信息store
export const useUserStore = defineStore('user', () => {
  //从localStorage获取存储的用户信息
  const storedUser = localStorage.getItem('userInfo')
  const storedToken = localStorage.getItem('token')

  //用户信息
  const userInfo = ref(storedUser ? JSON.parse(storedUser) : null)

  //JWT令牌
  const token = ref(storedToken || '')

  //登录状态
  const isLoggedIn = computed(() => !!token.value)

  //设置用户信息和令牌
  function setUserInfo(data) {
    userInfo.value = {
      id: data.id,
      username: data.username,
      name: data.name,
    }
    token.value = data.token

    //持久化到localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    localStorage.setItem('token', token.value)
  }

  //退出登录
  function logout() {
    userInfo.value = null
    token.value = ''

    //清除localStorage
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    setUserInfo,
    logout,
  }
})
