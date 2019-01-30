import Vue from 'vue';
import App from './App';
// import router from '@/router/about-route'
import "@/assets/utils/directive";


import iview from 'iview';
import '@/assets/theme/index.less';
Vue.use(iview)

new Vue({
  el: '#platform',
  template: '<App/>',
  // router,
  components: {
    App,
  }
})



