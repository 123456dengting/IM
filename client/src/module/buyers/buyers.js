import Vue from 'vue';
import App from './App';
// import router from '@/router/about-route'
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
  el: '#buyers',
  template: '<App/>',
  // router,
  components: {
    App,
  }
})



