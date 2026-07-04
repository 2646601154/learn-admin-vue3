<template>
  <el-menu default-active="1" router>
    <el-menu-item index="/index">
      <template #title>
        <el-icon>
          <House />
        </el-icon>
        <span>主页</span>
      </template>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <User />
        </el-icon>
        <span>班级学员管理</span>
      </template>
      <el-menu-item index="/clazz">班级管理</el-menu-item>
      <el-menu-item index="/stu">学员管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon>
          <SetUp />
        </el-icon>
        <span>系统信息管理</span>
      </template>
      <el-menu-item index="/dept">部门管理</el-menu-item>
      <el-menu-item index="/emp">员工管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>
        <el-icon>
          <DataAnalysis />
        </el-icon>
        <span>数据统计管理</span>
      </template>
      <el-menu-item index="/report/emp">员工信息统计</el-menu-item>
      <el-menu-item index="/report/stu">学员信息统计</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
