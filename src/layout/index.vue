<template>
  <div class="layout">
    <!-- 视频背景 -->
    <video class="background-video" autoplay muted loop playsinline>
      <source src="@/assets/video/night.mp4" type="video/mp4" />
    </video>

    <!-- 页面内容 -->
    <div class="content-overlay">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
