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

    <!-- 页面内容区域 -->
    <div class="main-content">
      <div class="cursor-effects"></div>
      <router-view />
      <!-- 页脚自然跟随内容 -->
      <FooterBar class="footer-wrapper" />
    </div>
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
  min-height: 100vh; // 使用min-height而不是height，让内容可以撑开
  overflow-x: hidden; // 只隐藏横向溢出，允许纵向滚动
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

  .main-content {
    position: relative;
    z-index: 2; // 确保内容在最上层
    width: 100%;
    flex: 1;
    padding-top: 106px; // 增加padding-top为TopBar高度(86px) + 额外间距(20px)
    
    // 让内容可以自然流动和滚动
    overflow: visible;
    min-height: calc(100vh - 106px); // 调整最小高度计算，减去TopBar高度和padding
  }

  .footer-wrapper {
    position: relative;
    z-index: 3; // 确保页脚在内容之上
    width: 100%;
    margin-top: auto; // 让页脚自然跟随内容，但在内容不足时仍然保持在底部
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
