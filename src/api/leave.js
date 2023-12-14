import request from '@/utils/request'

export function newLeave(data) {
  return request({
    url: '/leave/newLeave',
    method: 'post',
    data
  })
}
