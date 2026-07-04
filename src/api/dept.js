import request from '@/utils/request'

//查询部门列表
export function getDeptList() {
  return request({
    url: '/depts',
    method: 'get',
  })
}
//新增
// export function addDept(name) {
//     return request({
//         url: "/depts",
//         method: "post",
//         name

//     });
// }
export const addDept = (dept) => {
  return request.post('/depts', dept)
}
//查询回显 id
export function getDeptById(id) {
  return request({
    url: '/depts/' + id,
    method: 'get',
  })
}

//删除
export function deleteDept(id) {
  return request({
    url: '/depts/' + id,
    method: 'delete',
  })
}
//修改
export function updateDept(dept) {
  return request({
    url: '/depts',
    method: 'put',
    data: dept,
  })
}
