import { asyncRoutes, constantRoutes,errorRoutes } from '@/router';
import { getAuthMenu } from '@/api/menuRouter';//这是请求后端的路由接口
import Layout from '@/layout'
import {asyncRouteMenu} from "@/router/modules/asyncRoute.js";
import {Message} from "element-ui";

export function generaMenu(routes, data) {
  data.forEach(item => {
    let menu
    if (item.children == null) {
      const component = item.component? asyncRouteMenu[`${item.route}`] : Layout;
      menu = {
        path: `${item.path}`,
        component: Layout,
        alwaysShow: true,
        children: [
          {
            path: `index`,
            name: `${item.route_name}`,
            meta: { title: `${item.name}`}
          }
        ]
      }
      if(item.component){
        menu.children[0].component = component;
      }
    } else {

      let menuSub=[];

      for(let itemIn of item.children){
        const component = itemIn.component? asyncRouteMenu[`${itemIn.component}`] : Layout;
        let obj = {
          path:`${itemIn.path}`,
          component,
          name: `${itemIn.name}`,
          meta: { title:`${itemIn.name}`}
        }
        menuSub.push(obj)
      }
      menu = {
        path: `${item.path}`,
        component: Layout,
        alwaysShow: true,
        children: [].concat(menuSub),
        name: `${item.name}`,
        meta: { title: `${item.name}`, icon: `${item.iconCls}`}
      }
    }
    routes.push(menu)
  })
}

export const loadView = (path) => { // 路由懒加载
                                    // return (resolve) => require(`${path}`)
  return () => import(`${path}`)
}


/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes).concat(errorRoutes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const loadMenuData = []
      // 先查询后台并返回左侧菜单数据并把数据添加到路由
      getAuthMenu().then(response => {
        if (response.code !== 200) {
          Message({
            message: "菜单数据加载异常",
            type: 0,
            duration: 2 * 1000
          });
        } else {
          let data = response.data
          Object.assign(loadMenuData, data);
          let routes=[]
          generaMenu(routes,data)
          let accessedRoutes
          // if (roles.includes('admin')) {
          //   accessedRoutes = asyncRoutes || []
          // } else {
          accessedRoutes = routes
          // }
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        }
      }).catch(error => {
        console.log(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

