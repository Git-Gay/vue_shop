import Vue from 'vue'
import Router from 'vue-router'

const Login = () =>import('../components/Login')
const Home = () =>import('../components/Home')
const Welcome = () =>import('../components/Welcome')
const User = () =>import('../components/user/User')
const Rights = () => import('../components/power/Rights')
const Roles = () => import('../components/power/Roles')
Vue.use(Router)
const routes = [
  { path: '', redirect: '/login'},
  { path: '/login', component: Login},
  { path: '/home', component: Home, redirect: '/welcome',
    children:[
      { path:'/welcome', component: Welcome},
      { path:'/users' , component: User},
      { path: '/rights' ,component: Rights},
      { path: '/roles' ,component: Roles},
    ]
  },
]
const router = new Router({
  routes,
  mode:'history'
})

router.beforeEach((to, from, next) =>{
  // to要访问的路径
  //from 代表从哪个路径跳转而来，
  //next是一个函数，表示放行
  // next()放行，next('/login')强制跳转
    if(to.path === '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token');
    if(!tokenStr) return next('/login');
    next()
})
export default router;