import Vue from 'vue'
//import ElementUI from 'element-ui'
//import 'element-ui/lib/theme-chalk/index.css'
import Antd from 'ant-design-vue'
import { Modal,message } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VueRouter from "vue-router";

import {SemanticAnalysisRequest,SemanticAnalysisBaseRequest} from '@/utils'
import router from "./router"
import axios from 'axios'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import '@/icons'
import Icon from 'vue-awesome/components/Icon'

Vue.component('icon', Icon)

import "@/styles/index.scss"

Vue.config.productionTip = false

Vue.use(VueRouter)
//Vue.use(ElementUI)
Vue.use(Vuelidate)
Vue.use(Antd)
Vue.use(Modal)

Vue.prototype.Request = SemanticAnalysisRequest
Vue.prototype.$http = axios
Vue.prototype.BaseRequest = SemanticAnalysisBaseRequest

Vue.config.productionTip = false

Vue.prototype.Message = message
Vue.prototype.Confirm = Modal.confirm
Vue.prototype.Notify = Vue.prototype.$notification

new Vue({
  el: '#app',
  router,
  axios,
  render: h => h(App)
})
