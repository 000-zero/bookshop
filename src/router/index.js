import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store';
import { Notify, Toast } from 'vant';


const Home= () => import('../views/home/Home');
const Category = () => import('../views/category/Category');
const Detail = () => import('../views/detail/Detail');
const Profile = () => import('../views/profile/Profile');
const ShopCart = () => import('../views/shopcart/ShopCart');
const Register = () => import('../views/profile/Register');
const Login = () => import('../views/profile/Login');
const Address = () => import('../views/profile/Address');
const AddressEdit = () => import('../views/profile/AddressEdit');


const routes = [
  {
    path: '',
    name: 'DefaultHome',
    component: Home,
    meta:{
      title:'读书兄弟'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta:{
      title:'读书兄弟-商品分类'
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta:{
      title:'读书兄弟-商品详情'
    }
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component: ShopCart,
    meta:{
      title:'读书兄弟-购物车',
      isAuthRequired:true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta:{
      title:'读书兄弟-个人中心',
      isAuthRequired:true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title:'图书兄弟-用户注册'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title:'图书兄弟-用户登录'
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta: {
      title:'图书兄弟-地址管理',
      isAuthRequired:true
    }
  },
  {
    path: '/addressedit',
    name: 'AddressEdit',
    component: AddressEdit,
    meta: {
      title:'图书兄弟-编辑地址',
      isAuthRequired:true
    }
  },
  
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next)=>{
  if(to.meta.isAuthRequired && store.state.user.isLogin === false){
    Notify('您还没有登录，请先登录');
    return next('/login')
  }else{
    store.dispatch('updateCart');
    next();
  }
  
 document.title = to.meta.title;
})

export default router
