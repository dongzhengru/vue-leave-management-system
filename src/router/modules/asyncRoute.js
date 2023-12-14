/**
 * 动态路由配置，需要权限
 */
export const asyncRouteMenu = {
  "NewLeave": () => import('@/views/Leave/NewLeave.vue'),
  "QueryLeave": () => import('@/views/Leave/QueryLeave.vue'),
  "Approval": () => import('@/views/Workspace/Approval.vue'),
  "Statistic": () => import('@/views/Workspace/Statistic.vue'),
  "UserMana": () => import('@/views/System/UserMana.vue'),
  "UnitMana": () => import('@/views/System/UnitMana.vue'),
  "ClassMana": () => import('@/views/System/ClassMana.vue'),
}
