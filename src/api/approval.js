import request from '@/utils/request'

export function agreeApproval(data) {
  return request({
    url: '/approval/agree',
    method: 'post',
    data
  })
}
