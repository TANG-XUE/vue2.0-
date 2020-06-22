import axios from 'axios'

//设置响应数据的返回格式
// axios.interceptors.response.use(response=>{
//   return response.data.data;//直接返回数据中data选项中的data[想要的数据]
// })

//请求数据
export let getDataAll = ()=>{
  return axios.get('/static/mock/data.json')
}


