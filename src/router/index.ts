import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "layout",
    redirect: "/home",
    component: () => import("@/layout/index.vue"),
    meta: { title: "首页" },
    children: [
      { path: "/home",   name: "home",   component: () => import("@/views/home/index.vue"),   meta: { title: "时光广场" } },
      { path: "/photo",  name: "photo",  component: () => import("@/views/photo/index.vue"),  meta: { title: "相册" } },
      { path: "/setting",name: "setting",component: () => import("@/views/setting/index.vue"),meta: { title: "设置" } },
      { path: "/404",    name: "404",    component: () => import("@/views/404/index.vue"),    meta: { title: "页面不存在" } },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录 · fan时光" },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/register/index.vue"),
    meta: { title: "注册 · fan时光" },
  },
  { path: "/:pathMatch(.*)*", redirect: "/404" },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

/* 页面标题自动切换 */
router.afterEach((to) => {
  document.title = (to.meta?.title as string) || "fan时光";
});
