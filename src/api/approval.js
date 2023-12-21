import request from '@/utils/request'

export function agreeApproval(data) {
  return request({
    url: '/approval/agree',
    method: 'post',
    data
  })
}

export function rejectApproval(data) {
  return request({
    url: '/approval/reject',
    method: 'post',
    data
  })
}

export function countUnFinished() {
  return request({
    url: '/approval/unFinished',
    method: 'get'
  })
}

export function statistic() {
  return request({
    url: '/approval/statistic',
    method: 'get'
  })
}
