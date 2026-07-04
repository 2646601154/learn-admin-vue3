<script setup>
import { onMounted, ref, watch, nextTick } from 'vue'
import { addEmp, deleteEmp, getEmpById, getEmpList, updateEmp } from '@/api/emp.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDeptList } from '@/api/dept.js'

//元数据
//职位列表数据
const jobs = ref([
  { name: '班主任', value: 1 },
  { name: '讲师', value: 2 },
  { name: '学工主管', value: 3 },
  {
    name: '教研主管',
    value: 4,
  },
  { name: '咨询师', value: 5 },
  { name: '其他', value: 6 },
])
//性别列表数据
const genders = ref([
  { name: '男', value: 1 },
  { name: '女', value: 2 },
])
//部门列表
const depts = ref([])
onMounted(async () => {
  const result = await getDeptList()
  if (result.code) {
    depts.value = result.data
  }
})

const searchEmp = ref({
  name: '',
  gender: '',
  date: [],
  begin: '',
  end: '',
})

watch(
  () => searchEmp.value.date,
  (newValue, oldValue) => {
    if (newValue.length === 2) {
      searchEmp.value.begin = newValue[0]
      searchEmp.value.end = newValue[1]
    } else {
      searchEmp.value.begin = ''
      searchEmp.value.end = ''
    }
  },
)
const search = async () => {
  const result = await getEmpList({
    name: searchEmp.value.name,
    gender: searchEmp.value.gender,
    begin: searchEmp.value.begin,
    end: searchEmp.value.end,
    page: currentPage.value,
    pageSize: pageSize.value,
  })
  if (result.code) {
    empList.value = result.data.rows
    total.value = result.data.total
  }
}

const clickQueryButton = () => {
  search()
}

const clickResetButton = () => {
  searchEmp.value = {
    name: '',
    gender: '',
    date: [],
    begin: '',
    end: '',
  }
}

const empList = ref([
  {
    id: 1,
    username: '张三',
    name: '张三',
    gender: 1,
    image: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    job: 2,
    salary: 5000,
    entryDate: '2021-01-01',
    deptId: 1,
    deptName: '部门1',
    createTime: '2021-01-01 10:00:00',
    updateTime: '2021-01-01 10:00:00',
  },
])

const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
const handleSizeChange = (val) => {
  search()
  console.log(`每页 ${val} 条`)
}
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`)
  search()
}
onMounted(() => {
  search()
})

//点击新增员工按钮
const clickAddEmpButton = async () => {
  dialogVisible.value = true
  dialogTitle.value = '新增员工'
  await nextTick() // 等待对话框渲染完成
  employee.value = {
    username: '',
    name: '',
    gender: '',
    phone: '',
    job: '',
    salary: '',
    deptId: '',
    entryDate: '',
    image: '',
    exprList: [],
  }
  //清空校验
  empFormRef.value.clearValidate()
}

//新增/修改表单
const employee = ref({
  username: '',
  name: '',
  gender: '',
  phone: '',
  job: '',
  salary: '',
  deptId: '',
  entryDate: '',
  image: '',
  exprList: [],
})

// 控制弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增员工')

//文件上传
// 图片上传成功后触发
const handleAvatarSuccess = (response) => {
  console.log(response)
}
// 文件上传之前触发
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上传图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上传10M以内图片')
    return false
  }
  return true
}
//添加工作经历
const clickAddExprButton = () => {
  employee.value.exprList.push({
    company: '',
    job: '',
    begin: '',
    end: '',
    exprDate: [],
  })
}
const clickDeleteExprButton = (index) => {
  employee.value.exprList.splice(index, 1)
}
watch(
  () => employee.value.exprList,
  (newValue, oldValue) => {
    if (employee.value.exprList && employee.value.exprList.length > 0) {
      employee.value.exprList.forEach((item) => {
        item.begin = item.exprDate[0]
        item.end = item.exprDate[1]
      })
    }
  },
  { deep: true },
)
//表单提交
const save = async () => {
  // 先进行表单校验
  try {
    await empFormRef.value.validate()
    // 校验通过后提交数据
    let result
    if (employee.value.id) {
      result = await updateEmp(employee.value)
    } else {
      result = await addEmp(employee.value)
    }

    if (result.code) {
      ElMessage.success('保存成功')
      dialogVisible.value = false
      search()
    } else {
      ElMessage.error(result.msg)
    }
  } catch (error) {
    // 校验失败，error 包含具体的校验错误信息
    console.log('表单校验失败:', error)
    // Element Plus 会自动显示错误信息，这里可以不做额外处理
  }
}

//表单校验规则
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度应在2到20个字符之间', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度应在2到10个字符之间', trigger: 'blur' },
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' },
  ],
})

//表单校验
const empFormRef = ref()

//点击编辑按钮
const clickEditButton = async (emp) => {
  dialogVisible.value = true
  dialogTitle.value = '编辑员工'
  //清空校验
  await nextTick() // 等待对话框渲染完成
  empFormRef.value.clearValidate()
  const result = await getEmpById(emp.id)
  if (result.code) {
    employee.value = result.data
    // 使用 nextTick 确保 DOM 更新后再处理 exprList
    await nextTick()
    if (employee.value.exprList) {
      employee.value.exprList = employee.value.exprList.map((item) => {
        item.exprDate = [item.begin, item.end]
        return item
      })
    }
  }
}

const clickDeleteButton = (emp) => {
  ElMessageBox.confirm('确认删除该员工吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const result = await deleteEmp(emp.id)
      if (result.code) {
        ElMessage.success('删除成功')
        search()
      }
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}

//批量删除
//记录勾选的员工id
const checkedEmpIds = ref([])

const handleSelectionChange = (emp) => {
  checkedEmpIds.value = emp.map((item) => item.id)
}
//点击批量删除按钮
const clickDeleteBatchButton = () => {
  ElMessageBox.confirm('确认删除选中的' + checkedEmpIds.value.length + '条数据吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const result = await deleteEmp(checkedEmpIds.value)
    if (result.code) {
      ElMessage.success('删除成功')
      search()
    }
  })
}
</script>

<template>
  <!-- 标题 -->
  <h2 class="title">员工管理</h2>
  <!-- 搜索栏 姓名 性别 入职时间（开始与结束）查询按钮 清空按钮-->
  <div class="container">
    <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="searchEmp.name" placeholder="姓名" clearable />
      </el-form-item>

      <el-form-item label="性别">
        <el-select v-model="searchEmp.gender" placeholder="请选择性别" clearable>
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="入职日期">
        <el-date-picker
          v-model="searchEmp.date"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clickQueryButton">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="clickResetButton">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 两个按钮：新增员工和批量删除 -->
  <div class="container">
    <el-button type="primary" @click="clickAddEmpButton">新增员工</el-button>
    <el-button type="danger" @click="clickDeleteBatchButton">批量删除</el-button>
  </div>

  <!-- 信息表格 -->
  <el-table :data="empList" border style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="50" align="center" />
    <el-table-column type="index" label="序号" width="60" align="center" />
    <el-table-column label="姓名" prop="name" align="center" />
    <el-table-column label="性别" align="center">
      <template #default="scope">
        <el-tag v-if="scope.row.gender === 1" type="success" disable-transitions>男</el-tag>
        <el-tag v-else type="danger" disable-transitions>女</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="头像" prop="image" align="center">
      <template #default="scope">
        <el-avatar shape="square" :size="50" :src="scope.row.image" />
      </template>
    </el-table-column>
    <el-table-column label="所属部门" prop="deptName" align="center" />
    <el-table-column label="职位" prop="job" align="center">
      <template #default="scope">
        <el-tag v-if="scope.row.job === 1" type="success" disable-transitions>班主任</el-tag>
        <el-tag v-else-if="scope.row.job === 2" type="primary" disable-transitions>讲师</el-tag>
        <el-tag v-else-if="scope.row.job === 3" type="primary" disable-transitions>学工主管</el-tag>
        <el-tag v-else-if="scope.row.job === 4" type="primary" disable-transitions>教研主管</el-tag>
        <el-tag v-else-if="scope.row.job === 5" type="primary" disable-transitions>咨询师</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="入职日期" prop="entryDate" align="center" />
    <el-table-column label="最后操作时间" prop="updateTime" align="center" />
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button type="primary" size="small" @click="clickEditButton(scope.row)">编辑</el-button>
        <el-button type="danger" size="small" @click="clickDeleteButton(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页条 -->
  <div class="container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 50]"
      :size="'default'"
      :background="background"
      layout=" sizes ,-> ,total, , prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <!--  新增员工和修改员工的form表单-->
  <!-- 新增/修改员工的对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form :model="employee" label-width="80px" :rules="rules" ref="empFormRef">
      <!-- 基本信息 -->
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="employee.username"
              placeholder="请输入员工用户名，2-20个字"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="employee.name" placeholder="请输入员工姓名，2-10个字"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="employee.gender" placeholder="请选择性别" style="width: 100%">
              <el-option
                v-for="item in genders"
                v-bind:key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="employee.phone" placeholder="请输入员工手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="职位">
            <el-select v-model="employee.job" placeholder="请选择职位" style="width: 100%">
              <el-option
                v-for="item in jobs"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="薪资">
            <el-input v-model="employee.salary" placeholder="请输入员工薪资"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属部门">
            <el-select v-model="employee.deptId" placeholder="请选择部门" style="width: 100%">
              <el-option
                v-for="item in depts"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职日期">
            <el-date-picker
              v-model="employee.entryDate"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="/api/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="employee.image" :src="employee.image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 工作经历 -->
      <!-- 第六行 -->
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="工作经历">
            <el-button type="success" size="small" @click="clickAddExprButton"
              >+ 添加工作经历</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第七行 ...  工作经历 -->
      <el-row :gutter="3" v-for="(item, index) in employee.exprList" :key="item">
        <el-col :span="10">
          <el-form-item size="small" label="时间" label-width="80px">
            <el-date-picker
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              v-model="item.exprDate"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="公司" label-width="60px">
            <el-input v-model="item.company" placeholder="请输入公司名称"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="职位" label-width="60px">
            <el-input v-model="item.job" placeholder="请输入职位"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-form-item size="small" label-width="0px">
            <el-button type="danger" @click="clickDeleteExprButton(index)">- 删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
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

.demo-form-inline .el-input {
  --el-input-width: 180px;
}

.demo-form-inline .el-select {
  --el-select-width: 120px;
}

.avatar {
  height: 40px;
}

.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  border-radius: 10px;
  /* 添加灰色的虚线边框 */
  border: 1px dashed var(--el-border-color);
}
</style>
