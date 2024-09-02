import { createApp } from 'vue'
import './main.less'
import 'weui/dist/style/weui.min.css'
import '@fortawesome/fontawesome-svg-core/styles.css';
import App from './App.vue'
import router from './router'
import store from "./store";
import VueCookies from 'vue-cookies'
// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// v-viewer
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

// 将所需图标添加到库中
library.add(fas, far)

const app = createApp(App);

// 全局注册 FontAwesomeIcon 组件
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)
    .use(store)
    .use(VueCookies)
    .use(VueViewer)
    .mount('#app');
