<template>
  <div class="home-page">
    <!-- 内容层 -->
    <div class="title">
      <Magnet
        :padding="120"
        :disabled="false"
        :magnet-strength="3"
        active-transition="transform 0.2s ease-out"
        inactive-transition="transform 0.6s ease-in-out"
        wrapper-class-name="custom-wrapper"
        inner-class-name="custom-inner"
      >
        <div class="magnet-element">
          <h1>欢迎来到fan时光</h1>
          <p>值得记录，当然也值得回味。</p>
        </div>
      </Magnet>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { Motion } from "motion-v";
import Magnet from "@/components/Magnet.vue";
</script>

<style scoped lang="scss">
.home-page {
  position: relative;
  min-height: calc(100vh - 20px);
  overflow: hidden;

  .title {
    position: relative;
    z-index: 1;
    margin-bottom: 20px;
    padding: $padding-16;
    text-align: center;

    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    p {
      font-size: $font-size-14;
      opacity: 0.8;
    }
  }
}
</style>
