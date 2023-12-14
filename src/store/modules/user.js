import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui';

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    username: '',
    unitName: '',
    major: '',
    classNo: '',
    isTeacher: '',
    role: [],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_UNITNAME: (state, unitName) => {
    state.unitName = unitName
  },
  SET_MAJOR: (state, major) => {
    state.major = major
  },
  SET_CLASSNO: (state, classNo) => {
    state.classNo = classNo
  },
  SET_ISTEACHER: (state, isTeacher) => {
    state.isTeacher = isTeacher
  },
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data
        commit('SET_NAME', data.realName)
        commit('SET_USERNAME', data.username)
        commit('SET_UNITNAME', data.unitName)
        commit('SET_MAJOR', data.major)
        commit('SET_CLASSNO', data.classNo)
        commit('SET_ISTEACHER', data.isTeacher)
        commit('SET_ROLE', data.role)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(response => {
        if (response.code === 200) {
          Message.success(response.msg)
          removeToken()
          resetRouter()
          sessionStorage.clear();
          commit('RESET_STATE')
          resolve()
        } else {
          Message.error(response.msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

