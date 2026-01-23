<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <TopBar v-show="!isShowModal" />
    <!-- 背景视频 (双层淡入淡出) -->
    <video class="background-video" :class="{ visible: !isDark }" src="http://video.fanblog.top/daytime_compressed.mp4" autoplay muted loop
      playsinline></video>
    <video class="background-video" :class="{ visible: isDark }" src="http://video.fanblog.top/6865c088-3fb6-41c9-9744-4bc45ca4a015.mp4" autoplay muted loop
      playsinline></video>

    <!-- 页面内容区域 -->
    <div class="main-content" :style="{ paddingTop: $route.name === '404'||$route.name==='setting' ? '76px' : '100px' }">
      <div class="cursor-effects"></div>
      <router-view />
      <!-- 页脚只在 home 和 photo 路由时显示 -->
      <FooterBar v-if="showFooter" class="footer-wrapper"/>
    </div>
      <FloatingAddBtn v-if="!isShowModal&&$route.name!=='setting'" :bottom="bottom" @click="add" />
  </div>
</template>

<script setup lang="ts">
import { router } from "@/router";
import FloatingAddBtn from "./components/FloatingAddBtn.vue";
import { storeToRefs } from "pinia";
import { useSettingStore } from "../store/setting";
import TopBar from "@/layout/components/TopBar.vue";
import FooterBar from "@/layout/components/FooterBar.vue";
import { ref, onMounted, computed } from "vue";
const settingStore = useSettingStore();
const { isDark ,isShowModal} = storeToRefs(settingStore);
const bottom = ref(30)
// 显示页脚的路由名称列表
const showFooterNameList = ['home', 'photo']

// 计算是否显示页脚
const showFooter = computed(() => {
  const currentRouteName = router.currentRoute.value.name
  return showFooterNameList.includes(currentRouteName as string)
})

onMounted(() => {
  const storedIsDark = localStorage.getItem("isDark");
  if (storedIsDark === "true") {
    settingStore.toggleDarkMode();
    document.body.classList.add("dark-mode");
  }
});

const add = () => {
  if (router.currentRoute.value.name === 'home') {
    settingStore.openAddMode()
  }
  else {
    settingStore.openAddMediaModal()
  }
};
// 监听页面滚动变化 实现底部bottom的变化
const scrollBottom = () => {
  // 距离顶部的高度
  let scrollTop = document.documentElement.scrollTop
  // 屏幕高度(视口高度)
  let clientHeight = document.documentElement.clientHeight
  // 内容高度(是文档实际内容的高度， 不随滚动变化)
  let scrollHeight = document.documentElement.scrollHeight

  if (scrollTop + clientHeight + 165 >= scrollHeight) {
    // 当视口底部接近文档底部（页脚）还有 165px 时就开始上浮
    bottom.value=scrollTop+clientHeight+165-scrollHeight
  }else{
    bottom.value=30
  }
}
// 监听滚动事件
window.addEventListener('scroll', scrollBottom)

</script>

<style scoped lang="scss">
.layout {
  position: relative;
  width: 100%;
  min-height: 100vh;
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
 // 为固定定位的TopBar让出空间

    // 让内容可以自然流动和滚动
    overflow: visible;
    min-height: calc(100vh - 86px); // 调整最小高度计算，减去TopBar高度和padding
  }

  .footer-wrapper {
    position: relative;
    z-index: 3; // 确保页脚在内容之上
    width: 100%;
    margin-top: auto;
    
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
