import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/getUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getTeacherList(keyword) {
  return request({
    url: '/user/getTeacherList',
    method: 'get',
    params: {keyword: keyword}
  })
}
