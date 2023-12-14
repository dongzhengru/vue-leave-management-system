import request from "@/utils/request";

export function modifyPwd(data) {
  return request({
    url: '/system/modifyPwd',
    method: 'post',
    data
  })
}
