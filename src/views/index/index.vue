<script setup></script>

<template>
  <div class="index-page">
    <h1>欢迎使用 LearnAdmin 后台管理系统</h1>
    <p>
      LearnAdmin 是一套基于 Vue 3 + Element Plus
      的企业级后台管理解决方案，致力于为教育培训机构提供高效、便捷的管理工具。
    </p>
    <p>
      系统涵盖班级学员管理、系统信息管理、数据统计管理等核心模块。通过班级管理与学员管理，您可以轻松组织教学资源；通过部门管理与员工管理，您可以高效调配人力资源；通过员工信息统计与学员信息统计，您可以直观掌握运营数据。
    </p>
    <p>
      本系统采用 Vue 3 Composition API 构建，搭配 Vue Router 实现嵌套路由、Pinia 进行状态管理，UI
      基于 Element Plus 组件库，为您带来流畅的使用体验。
    </p>
  </div>
</template>

<style scoped>
.index-page {
  padding: 24px;
  line-height: 2;
  font-size: 15px;
  color: #303133;
}

.index-page h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.index-page p {
  text-indent: 2em;
  margin-bottom: 12px;
}
</style>
