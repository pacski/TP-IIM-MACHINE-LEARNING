import Vue from 'vue'
import Router from 'vue-router'
import Threejs from'@/components/Threejs'
import Power4 from'@/components/Power4'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/three/',
      name: 'Threejs',
      component: Threejs
    },
    {
      path: '/power4/',
      name: 'Power4',
      component: Power4
    }
  ]
})
