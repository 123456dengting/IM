import Vue from 'vue'
import Router from 'vue-router'
import index from '@/module/service/views/index';
import usermanager from '@/module/service/views/usermanager';
import labelmanager from '@/module/service/views/labelmanager';
import track from '@/module/service/views/track';

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/usermanager',
      name: 'usermanager',
      component: usermanager
    },
    {
      path: '/labelmanager',
      name: 'labelmanager',
      component: labelmanager
    },
    {
      path: '/track',
      name: 'track',
      component: track
    },
  ]
})