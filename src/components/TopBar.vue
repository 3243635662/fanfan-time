<template>
  <div class="top-bar">
    <div class="logo">
      <AppIcon
        class="logo-icon"
        name="streamline-freehand-color:messages-bubble-smile"
        size="30"
        color="#4353d3"
      />
      <p>fan时光</p>
    </div>
    <div class="menu"></div>
    <div class="setting"></div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSettingStore } from "../store/setting";
import AppIcon from "@/components/AppIcon.vue";
const settingStore = useSettingStore();
const { isDark } = storeToRefs(settingStore);
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.top-bar {
  width: 100%;
  height: 52px;
  background: #ffffffcc;
  box-shadow: 0 0 4px 0 #0000001a;
  backdrop-filter: blur(30px);
  display: flex;
  align-items: center;

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
}
</style>
