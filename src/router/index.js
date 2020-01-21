import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import HelloWorldPro from '@/components/HelloWorldPro'
import makingForm from '@/views/makingForm'
import generate from  '@/views/fm-generate'
import draggable from  '@/views/draggable'
import viewer from  '@/components/viewer'
import ViewerPro from  '@/components/ViewerPro'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/pro',
      name: 'HelloWorldPro',
      component: HelloWorldPro
    },
    {
      path: '/makingForm',
      name: 'makingForm',
      component: makingForm
    },
    {
      path: '/generate',
      name: 'generate',
      component: generate
    },
    {
      path:'/draggable',
      name:'draggable',
      component:draggable
    },
    {
      path:'/viewer',
      name:'viewer',
      component:viewer
    },
    {
      path:'/ViewerPro',
      name:'ViewerPro',
      component:ViewerPro
    }
  ]
})
