import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store'
import './assets/iconfont/iconfont.css'



Vue.config.productionTip = false

//引入element ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//引入fetch
import Fetch from './assets/js/fetch'
Vue.prototype.$fetch = Fetch
//引入commonjs 全局方法
import './common'

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
