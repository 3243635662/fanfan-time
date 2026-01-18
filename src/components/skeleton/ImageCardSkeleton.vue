<template>
  <div class="image-card-skeleton">
    <div class="skeleton-image" :style="{ height: imageHeight }"></div>
    <div class="skeleton-line" :style="{ width: '90%', height: '14px', margin: '8px 0' }"></div>
    <div class="skeleton-footer">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-line" :style="{ width: '60px', height: '12px' }"></div>
      <div class="skeleton-line" :style="{ width: '40px', height: '12px', marginLeft: 'auto' }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  imageHeight: {
    type: String,
    default: '200px'
  }
})
</script>

<style scoped>
.image-card-skeleton {
  width: 100%;
  box-sizing: border-box;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  padding: 0;
  .dark-mode & {
    background-color: #333;
  }
}

.skeleton-image,
.skeleton-line,
.skeleton-avatar {
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 37%, #e0e0e0 63%);
  background-size: 200% 100%;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  animation: skeleton-shimmer 1.5s infinite;
    .dark-mode & {
      background: linear-gradient(90deg, #444 25%, #555 37%, #444 63%);
  }
}

.skeleton-image {
  width: 100%;
  border-radius: 10px;
  background-size: 200px 100%;
  min-height: 300px;
}

.skeleton-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-footer {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 8px;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}
</style>
