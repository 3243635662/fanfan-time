<template>
  <div class="top-bar">
    <div class="logo">
      <AppIcon class="logo-icon" name="line-md:emoji-smile" size="30" />
      <p>fan时光</p>
    </div>
    <div class="menu">
      <Dock :items="items" :panel-height="50" :base-item-size="38" :magnification="70" :distance="90" :dock-height="100"
        :spring="{ mass: 0.03, stiffness: 150, damping: 12 }" :set-dock-title="setDockTitle" />
    </div>
    <div class="add">
      <AppIcon class="add-icon" name="icon-park:add-one" size="28" @click="add" />
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
        name: "line-md:home-alt-twotone",
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
        name: "line-md:cog-loop",
        size: "22",
        color: "#d4a5a0",
      }),
    title: "个人中心",
    onClick: () => router.push({ name: "setting" }),
  },
];


const add = () => {
  console.log("Add clicked!");
  settingStore.openAddMode()
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
  height: 100px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: space-between; // 左中右布局
  transition: all var(--transition-duration) ease;

  .logo {
    .logo-icon {
      padding: $padding-16;
      color: var(--color-text-primary);
    }

    p {
      font-weight: 600;
      font-size: $font-size-24;
      color: var(--color-text-primary);
    }

    display: flex;
    align-items: center;
  }

  .menu {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .add {
    flex-shrink: 0;
    height: $font-size-28;
    width: $font-size-28;
    padding: 0 $padding-24;
    cursor: pointer;

    .add-icon {
      color: var(--color-text-primary);
      &:hover {
        transform: rotate(180deg);
        transition: transform 0.5s ease-in-out;
      }

      &:active {
        transform: rotate(180deg) scale(0.6); // 点击时缩放反馈
      }
    }
  }
}

// 深色模式样式
body.dark-mode {
  .top-bar {
    background: rgba(13, 13, 13, 0.8);
    box-shadow: 0 0 4px 0 rgba(255, 255, 255, 0.1);
  }
}
</style>
