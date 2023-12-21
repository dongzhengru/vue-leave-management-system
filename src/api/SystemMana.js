import request from "@/utils/request";

export function modifyPwd(data) {
  return request({
    url: '/system/modifyPwd',
    method: 'post',
    data
  })
}

export function getAllUser(data) {
  return request({
    url: '/system/getAllUser',
    method: 'get',
    params: data
  })
}

export function resetPwd(id) {
  return request({
    url: '/system/resetPwd',
    method: 'get',
    params: {id: id}
  })
}

export function getAllUnit() {
  return request({
    url: '/system/getAllUnit',
    method: 'get'
  })
}

export function getAllClass() {
  return request({
    url: '/system/getAllClass',
    method: 'get'
  })
}
