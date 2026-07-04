<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppAside from '@/components/AppAside.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- 头部 -->
      <el-header class="header-card" style="padding: 0">
        <AppHeader />
      </el-header>
      <el-container class="body-container">
        <!-- 侧边栏 -->
        <el-aside class="aside-card" width="200px">
          <AppAside />
        </el-aside>
        <!-- 主体 -->
        <el-main class="main-card">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  background-color: #f5f7fa;
  padding: 12px;
  min-height: 100vh;
}

.header-card,
.aside-card,
.main-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.body-container {
  margin-top: 12px;
  gap: 12px;
}
</style>
