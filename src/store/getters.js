const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  username: state => state.user.username,
  unitName: state => state.user.unitName,
  major: state => state.user.major,
  classNo: state => state.user.classNo,
  isTeacher: state => state.user.isTeacher,
  role: state => state.user.role,
  permission_routes: state => state.permission.routes
}
export default getters
