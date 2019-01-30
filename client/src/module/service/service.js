import Vue from 'vue';
import App from './App';
import store from "@/vuex/vuex-service/store"
import router from '@/router/service-route'
import "@/assets/utils/directive";



import iview from 'iview';
import '@/assets/theme/index.less';
Vue.use(iview)

import VueLazyload from 'vue-lazyload'
import imgerr from '@/assets/images/imgerr.png'
Vue.use(VueLazyload,{
  error:imgerr
})

new Vue({
  el: '#service',
  template: '<App/>',
  router,
  store,
  components: {
    App,
  }
})



