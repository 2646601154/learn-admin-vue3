import request from '@/utils/request'

//查询员工列表
export const getEmpList = (params) => {
  return request({
    url: '/emps',
    method: 'get',
    params,
  })
}

//新增员工
export const addEmp = (emp) => {
  return request({
    url: '/emps',
    method: 'post',
    data: emp,
  })
}

//根据id查询员工
export const getEmpById = (id) => {
  return request({
    url: '/emps/' + id,
    method: 'get',
  })
}

//修改员工
export const updateEmp = (emp) => {
  return request({
    url: '/emps',
    method: 'put',
    data: emp,
  })
}

//删除员工 数组
export const deleteEmp = (ids) => {
  return request({
    url: '/emps',
    method: 'delete',
    params: {
      ids,
    },
  })
}
