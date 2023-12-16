import request from '@/utils/request'

export function getLeaveNo() {
  return request({
    url: '/leave/getLeaveNo',
    method: 'get'
  })
}

export function newLeave(data) {
  return request({
    url: '/leave/newLeave',
    method: 'post',
    data
  })
}

export function queryLeave(data) {
  return request({
    url: '/leave/queryLeave',
    method: 'post',
    params: data
  })
}
