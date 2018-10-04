import axios from 'axios'
import qs from 'qs'

// 默认apikey，之后从登陆中获取并传递到全局
axios.defaults.headers.apikey = 'test'
axios.defaults.baseURL = '/zxcity_restful/ws/rest'
axios.defaults.timeout = 10000

// 登陆方法
const login = (usercode, pwd) => {
  const data = qs.stringify({
    cmd: 'bootUser/login',
    data: JSON.stringify({
      usercode: usercode,
      password: pwd
    }),
    version: 1
  })
  return axios.post('', data)
}

// echarts
const echarts = (el) => {
  const data = qs.stringify({
    cmd: 'cms_new/newVotePeople',
    data: JSON.stringify(el),
    version: 1
  })
  return axios.post('', data)
}

// form提交
const formSubmit = (formData) => {
  const data = qs.stringify({
    cmd: '',
    data: JSON.stringify(formData),
    version: 1
  })
  return axios.post('', data)
}

// 获取accessKeyId，accessKeySecret
const access = () => {
  const data = qs.stringify({
    cmd: 'oss/ossUpload',
    version: 1
  })
  return axios.post('', data)
}

// 可导出的方法
export default{
  testAxios: login,
  echartsAxios: echarts,
  formAxios: formSubmit,
  accessAxios: access
}
