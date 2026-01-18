<template>
  <div class="message-card-skeleton">
    <div class="skeleton-head">
      <div class="skeleton-line" :style="{ width: '80px', height: '12px' }"></div>
      <div class="skeleton-tag" :style="{ width: '60px', height: '24px' }"></div>
    </div>
    <div class="skeleton-content">
      <div class="skeleton-line" :style="{ width: '100%', height: '16px', marginBottom: '8px' }"></div>
      <div class="skeleton-line" :style="{ width: '90%', height: '16px', marginBottom: '8px' }"></div>
      <div class="skeleton-line" :style="{ width: '70%', height: '16px' }"></div>
    </div>
    <div class="skeleton-footer">
      <div class="skeleton-stats">
        <div class="skeleton-icon" :style="{ width: '18px', height: '18px' }"></div>
        <div class="skeleton-line" :style="{ width: '30px', height: '12px' }"></div>
        <div class="skeleton-icon" :style="{ width: '18px', height: '18px' }"></div>
        <div class="skeleton-line" :style="{ width: '30px', height: '12px' }"></div>
      </div>
      <div class="skeleton-line" :style="{ width: '60px', height: '12px' }"></div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.message-card-skeleton {
  width: 100%;
  box-sizing: border-box;
  background-color: #f0f0f0;
  border-radius: 20px;
  overflow: hidden;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
}

.skeleton-line,
.skeleton-tag,
.skeleton-icon {
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 37%, #e0e0e0 63%);
  background-size: 200% 100%;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  animation: skeleton-shimmer 1.5s infinite;
}

.skeleton-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.skeleton-tag {
  border-radius: 16px;
}

.skeleton-content {
  flex: 1;
  margin-bottom: 24px;
}

.skeleton-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skeleton-stats {
  display: flex;
  gap: 16px;
  align-items: center;
}

.skeleton-icon {
  border-radius: 50%;
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
