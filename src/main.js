// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueSpeech from 'vue-speech'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Antd from 'ant-design-vue' // 引入Ant Design Vue组件
import 'ant-design-vue/dist/antd.css' // 引入Ant Design Vue样式
Vue.use(Antd) //挂载到vue中

Vue.use(VueAxios, axios);
Vue.use(VueSpeech)
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})