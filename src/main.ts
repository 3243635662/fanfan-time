import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
// import "./styles/global.scss";
const app = createApp(App);
// 创建 pinia 实例
const pinia = createPinia();
// 使用 pinia
app.use(pinia);
// 使用路由
app.use(router);

app.mount("#app");
