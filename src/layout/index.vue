<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <TopBar />

    <!-- 背景视频 -->
    <video class="background-video" autoplay muted loop playsinline>
      <source :src="backVideoPath" type="video/mp4" />
    </video>

    <!-- 全局鼠标动效层 -->
    <div class="cursor-effects">
      <TextCursor
        text="💚"
        :delay="0.5"
        :spacing="60"
        :follow-mouse-direction="true"
        :random-float="true"
        :exit-duration="0.8"
        :removal-interval="500"
        :max-points="10"
      />
    </div>

    <!-- 点击特效层 -->

    <!-- 页面内容 -->
    <div class="content-overlay">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSettingStore } from "../store/setting";
import TopBar from "@/components/TopBar.vue";
import TextCursor from "@/components/Text-Cursor.vue";
import { computed } from "vue";

const settingStore = useSettingStore();
const { isDark } = storeToRefs(settingStore);

// 使用正确的视频路径 - 从public目录访问
const backVideoPath = computed(() => {
  return isDark.value ? "/video/night.mp4" : "/video/daytime.mp4";
});
</script>

<style scoped lang="scss">
.layout {
  pointer-events: none;
  user-select: none;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  .background-video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
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
    min-height: 100vh;
    padding-top: 20px; // 为TopBar留出空间
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
