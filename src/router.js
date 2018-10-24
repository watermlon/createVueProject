import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children:[
        {
          path:'/',
          name:'member',
          meta: { breadcrumb:['会员管理'] },
          component:()=>import('./views/member.vue')//会员管理
        },{
          path:'/goods/list',
          name:'goods-list',
          meta: { breadcrumb:['商品','商品列表'] },
          component:()=>import('./views/goods/goodsList.vue')//商品列表
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
