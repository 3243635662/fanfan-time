<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <TopBar />

    <!-- 背景视频 (双层淡入淡出) -->
    <video
      class="background-video"
      :class="{ visible: !isDark }"
      src="/video/daytime.mp4"
      autoplay
      muted
      loop
      playsinline
    ></video>
    <video
      class="background-video"
      :class="{ visible: isDark }"
      src="/video/night.mp4"
      autoplay
      muted
      loop
      playsinline
    ></video>

    <!-- 页面内容 -->
    <div class="content-overlay">
      <div class="cursor-effects"></div>
      <router-view />
    </div>
    <!-- 底部导航栏 -->
    <FooterBar />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSettingStore } from "../store/setting";
import TopBar from "@/layout/components/TopBar.vue";
import FooterBar from "@/layout/components/FooterBar.vue";

const settingStore = useSettingStore();
const { isDark } = storeToRefs(settingStore);
</script>

<style scoped lang="scss">
.layout {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .background-video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    opacity: 0;
    transition: opacity 1.5s ease-in-out;

    &.visible {
      opacity: 1;
    }
  }

  .cursor-effects {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0; // 在视频之上，内容之下
    pointer-events: none;
  }

  .content-overlay {
    position: relative;
    z-index: 2; // 确保内容在最上层
    width: 100%;
    flex: 1;
    overflow-y: auto;
    padding-top: 20px; // 为TopBar留出空间

    // 隐藏滚动条但保留滚动功能
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }
}

.interactive-area {
  width: 100%;
  height: 200px;
  border: 2px dashed #333;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
