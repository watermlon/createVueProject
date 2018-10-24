import Vue from 'vue'
import App from './App.vue'
import router from './router'
import iview from 'iview'
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import store from './store'
import qs from 'qs'
Vue.use(iview)
Vue.config.productionTip = false
Vue.prototype.$http = axios
/**
 * axios全局配置
 */
axios.defaults.timeout = 100000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.baseURL = APIpath;
axios.defaults.withCredentials = true;

/**
 * axios全局配置请求拦截
 */
axios.interceptors.request.use((res) => {
  let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  if (userInfo) {
    res.headers['token'] = userInfo.token
  }
  // res.data = qs.stringify(res.data);
  return res
});

/**
 * axios全局配置响应拦截
 */
axios.interceptors.response.use((req) => {
  console.log(req)
  if (req.status) {
    if (req.status == 200) {
      switch (req.data.status) {
        case '200':
          return req.data;
          break
        case '401':
          vm.$router.push('/login')
          break
        case '500':
          return Promise.reject(req.data.msg);
          break
        case '403':
        // vm.$router.push('/403')
        default:
          return req.data;
          break
      }
    }
  }
}, err => {
  console.log(err)
});
router.beforeEach((to, from, next) => {
  iview.LoadingBar.start();
  next();
});

router.afterEach(route => {
  iview.LoadingBar.finish();
});
Vue.prototype.$downloadFile = function (option = {
  method:'post',
  url:'',
  baseURL:APIpath,
  data:{}
}) {
  axios({
    method: option.method,
    url: option.url,
    data: option.data,
    baseURL: option.baseURL,
    responseType: 'blob'
  }).then(res => {
    const blob = this.response;
    const reader = new FileReader();
    reader.readAsDataURL(blob);    // 转换为base64，可以直接放入ahref
    reader.onload = function (e) {
      // 转换完成，创建一个a标签用于下载
      var a = document.createElement('a');
      a.download = fileName;
      a.href = e.target.result;
      document.querySelector('body').append(a);    // 修复firefox中无法触发click
      a.click();
      document.querySelector('body').removeChild(a);
    }
  })
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
