import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import "./styles/global.scss";

import { useAuthStore } from '@/store/auth';
import { useSettingStore } from '@/store/setting';

const app = createApp(App);
app.use(ArcoVue, {
  // 用于改变使用组件时的前缀名称
  componentPrefix: "arco",
});
app.use(createPinia());
app.use(router);

// 初始化登录状态（刷新页面时恢复本地 token）
useAuthStore().initAuth();

// 监听浏览器返回键，用于拦截 Modal 的返回手势
const settingStore = useSettingStore();
window.addEventListener('popstate', (event) => {
  settingStore.handlePopState(event);
});

app.mount("#app");
