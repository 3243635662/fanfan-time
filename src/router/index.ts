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
        {
          path: "/photo",
          name: "photo",
          component: () => import("@/views/photo/index.vue"),
        },
        {
          path: "/404",
          name: "404",
          component: () => import("@/views/404/index.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/404",
    },
  ],
});
