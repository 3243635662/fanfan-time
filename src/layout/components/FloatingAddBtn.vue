<template>
  <div class="container" :style="{ bottom: bottom + 'px' }">
    <AppIcon class="add-icon" name="icon-park:add-one" size="50" />
  </div>
</template>

<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue';
defineProps({
  bottom: {
    type: Number,
    default: 30
  }
})
</script>

<style lang="scss" scoped>
.container {
  transition: bottom 0.3s ease-in-out;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 30px;
  z-index: 100;

  .add-icon {
    &:hover {
      transform: rotate(180deg);
      transition: transform 0.5s ease-in-out;
    }

    &:active {
      transform: rotate(180deg) scale(0.6);
    }
  }
}
</style>
