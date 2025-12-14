<template>
  <div class="top-bar">
    <div class="logo">
      <AppIcon
        class="logo-icon"
        name="streamline-freehand-color:messages-bubble-smile"
        size="30"
      />
      <p>fan时光</p>
    </div>
    <div class="menu">
      <Dock
        :items="items"
        :panel-height="50"
        :base-item-size="38"
        :magnification="70"
        :distance="90"
        :dock-height="100"
        :spring="{ mass: 0.03, stiffness: 150, damping: 12 }"
        :set-dock-title="setDockTitle"
      />
    </div>
    <div class="email">
      <AppIcon
        class="email-icon"
        name="streamline-color:send-email-flat"
        size="28"
        @click="sendEmail"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { router } from "@/router/index";
import { h } from "vue";
import Dock from "@/components/MotionEffect/Dock.vue";
import { storeToRefs } from "pinia";
import { useSettingStore } from "../../store/setting";
import AppIcon from "@/components/AppIcon.vue";
const settingStore = useSettingStore();
const { isDark } = storeToRefs(settingStore);
const { setDockTitle } = settingStore;
const items = [
  {
    icon: () =>
      h(AppIcon, {
        name: "mdi:home",
        size: "22",
        color: "#6bb6c1",
      }),
    title: "首页",
    onClick: () => router.push({ name: "home" }),
  },
  {
    icon: () =>
      h(AppIcon, {
        name: "streamline-flex-color:photo-camera",
        size: "22",
      }),
    title: "照片墙",
    onClick: () => router.push({ name: "photo" }),
  },
  {
    icon: () =>
      h(AppIcon, {
        name: isDark.value
          ? "emojione-v1:new-moon-face"
          : "emojione-v1:full-moon-face",
        size: "22",
      }),
    title: "切换主题",
    onClick: () => settingStore.toggleDarkMode(),
  },
  {
    icon: () =>
      h(AppIcon, {
        name: "mdi:cog",
        size: "22",
        color: "#d4a5a0",
      }),
    title: "设置",
    onClick: () => console.log("Settings clicked!"),
  },
];

const sendEmail = () => {
  window.open("mailto:fanfan_0521@163.com");
};
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.top-bar {
  position: fixed; // 添加固定定位
  top: 0; // 固定在顶部
  left: 0; // 从左边开始
  z-index: 1000; // 确保在其他元素之上
  width: 100%;
  height: 86px;
  background: #ffffffcc;
  box-shadow: 0 0 4px 0 #0000001a;
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: space-between; // 左中右布局
  .logo {
    .logo-icon {
      padding: $padding-16;
    }
    p {
      font-weight: 600;
      font-size: $font-size-24;
    }
    display: flex;
    align-items: center;
  }
  .menu {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .email {
    flex-shrink: 0; // 防止被压缩
    padding: 0 24px; // 添加左右内边距
    cursor: pointer;
  }
}
</style>