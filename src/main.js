// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import FormMaking from 'form-making'
import 'form-making/dist/FormMaking.css'
import x2js from 'x2js'

Vue.use(FormMaking)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$x2js = new x2js() 


/* eslint-disable no-new */
Vue.prototype.$copy = function(v){return JSON.parse(JSON.stringify(v))}
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
