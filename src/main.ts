import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 引入模板的全局的样式
import '@/styles/index.scss'
// tailwind.css  https://www.tailwindcss.cn/docs
import '@/styles/tailwind.css'
import 'element-plus/dist/index.css'
// 黑暗模式
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/woff.scss' // 引入字体图标样式

// 必须：注册 SVG 图标（vite-plugin-svg-icons 核心步骤）
import 'virtual:svg-icons-register'
// element-plus svg icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 注册 element-plus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)

app.mount('#app')
