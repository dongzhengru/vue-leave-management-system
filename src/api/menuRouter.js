import request from "@/utils/request";

export function getAuthMenu() {
  return request({
    url: '/system/menu',
    method: 'get'
  })
}
