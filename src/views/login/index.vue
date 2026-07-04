<script setup>
import { callWithAsyncErrorHandling, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/login.js'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const loginForm = ref({
  username: '',
  password: '',
})

const loginFormRef = ref(null)

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleLogin = async () => {
  const result = await login(loginForm.value)
  if (result.code) {
    //登录成功，将用户信息和JWT令牌存储到Pinia中
    userStore.setUserInfo(result.data)
    ElMessage.success('登录成功')
    //跳转
    router.push('/index')
  } else {
    //失败
    ElMessage.error(result.msg)
  }
}
const handClear = () => {
  loginForm.value.username = ''
  loginForm.value.password = ''
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">LearnAdmin后台管理系统</h2>
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        <el-row justify="space-between">
          <el-col :span="10">
            <el-form-item>
              <el-button type="primary" size="large" style="width: 100%" @click="handleLogin"
                >登 录</el-button
              >
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <el-button type="primary" size="large" style="width: 100%" @click="handClear"
                >重 置</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('@/assets/cloud-night.png');
  background-size: cover;
  background-position: center;
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.login-card {
  width: 400px;
  border-radius: 12px;
  position: relative;
  z-index: 1;
}

.login-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 22px;
  color: #303133;
}
</style>
