import { createRouter, createWebHashHistory } from "vue-router";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "layout",
      redirect: "/home",
      component: () => import("@/layout/index.vue"),
      children: [
        {
          path: "/home",
          name: "home",
          component: () => import("@/views/home/index.vue"),
        },
      ],
    },
  ],
});
