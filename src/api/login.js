import request from '@/utils/request.js'

export const login = (data) => {
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}
