import Cookies from 'js-cookie'
const isAuthenticated = () => {
  return !!Cookies.get('task_token')
}

export default isAuthenticated