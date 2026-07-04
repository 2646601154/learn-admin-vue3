<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { getDeptList, addDept, getDeptById, updateDept, deleteDept } from '@/api/dept'
import { ElMessage, ElMessageBox } from 'element-plus'

const deptList = ref([])
const search = async () => {
  const result = await getDeptList()
  if (result.code) {
    deptList.value = result.data
  }
}
const dialogFormVisible = ref(false)
const dept = ref({
  name: '',
})
onMounted(() => {
  search()
})

const formTltle = ref('')
//点击添加按钮
const clickAddDeptButton = async () => {
  dialogFormVisible.value = true
  formTltle.value = '添加部门'
  dept.value = {}
  //等待dialog渲染完成后再清除校验
  await nextTick()
  //重置表单校验提示信息
  formRef.value.clearValidate()
}

const formRef = ref(null)
//点击确认按钮
const handerYes = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return ElMessage.error('填写有误')
  let result
  if (dept.value.id) {
    //id有值是修改操作
    result = await updateDept(dept.value)
  } else {
    //否则是添加操作
    result = await addDept(dept.value)
  }
  //成功
  if (result.code == 1) {
    ElMessage({
      message: '操作成功',
      type: 'success',
    })
    dialogFormVisible.value = false
    search()
  } else {
    //失败
    ElMessage.error(result.msg)
  }
}
const rules = ref({
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
  ],
})

const clickEditButton = async (row) => {
  dialogFormVisible.value = true
  formTltle.value = '编辑部门'
  //等待dialog渲染完成后再操作
  await nextTick()
  //重置表单校验提示信息
  formRef.value.clearValidate()
  //查询回显
  const result = await getDeptById(row.id)
  if (result.code) {
    dept.value = result.data
  }
}

const clickDeleteButton = (row) => {
  ElMessageBox.confirm('确认删除该部门吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const result = await deleteDept(row.id)
      if (result.code == 1) {
        ElMessage.success('删除成功')
        search()
      } else {
        ElMessage.error(result.msg)
      }
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}
</script>

<template>
  <h2 class="title">部门管理</h2>
  <div class="container">
    <el-button type="primary" @click="clickAddDeptButton">
      <el-icon>
        <Plus />
      </el-icon>
      <span>添加部门</span>
    </el-button>
  </div>
  <!-- 表格 -->
  <div class="container">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column prop="date" type="index" label="序号" min-width="20" align="center" />
      <el-table-column prop="name" label="部门名称" min-width="60" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" min-width="100" align="center" />
      <el-table-column prop="address" label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="clickEditButton(scope.row)">
            <el-icon>
              <Edit />
            </el-icon>
            <span>编辑</span>
          </el-button>
          <el-button type="danger" size="small" @click="clickDeleteButton(scope.row)">
            <el-icon>
              <Delete />
            </el-icon>
            <span>删除</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- dialog对话框 -->
  <el-dialog v-model="dialogFormVisible" :title="formTltle" width="500" align-center>
    <el-form ref="formRef" :model="dept" :rules="rules">
      <el-form-item label="部门名称" :label-width="80" prop="name">
        <el-input v-model="dept.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handerYes"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.title {
  margin: 0;
}

.container {
  margin: 18px 0;
}
</style>
