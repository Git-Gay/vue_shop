import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css';
import {Button,Form,FormItem,
        Input,Message,Container,
        Header,Aside,Main,Menu,
        Submenu,MenuItemGroup,
        MenuItem,Breadcrumb,BreadcrumbItem,Card,
        Row,Col,Table,TableColumn,Switch,Tooltip,
        Pagination,Dialog,MessageBox,Tag,Tree} from 'element-ui'
import axios from 'axios'
//网络请求
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.prototype.$http = axios
//拦截
axios.interceptors.request.use(config =>{
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
//全局挂载Message组件，可在其他组件内通过this.$message进行访问
Vue.prototype.$message = Message
Vue.config.productionTip = false
Vue.prototype.$confirm = MessageBox.confirm
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
