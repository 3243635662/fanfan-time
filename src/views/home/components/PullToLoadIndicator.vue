<template>
  <div 
    class="pull-indicator"
    :class="{ 
      'is-pulling': isPulling,
      'is-loading': isLoading,
      'type-bottom': type === 'bottom'
    }"
  >
    <div class="pull-content" :style="{ transform: type === 'top' ? `translateY(${pullDistance * 0.5}px)` : 'none' }">
      <div class="spinner" v-if="isLoading && type === 'bottom'">
        <slot name="loading">
          <div class="default-spinner"></div>
        </slot>
      </div>
      <div class="arrow" v-else>
        <slot name="icon">
          <svg viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
          </svg>
        </slot>
      </div>
      <span class="text" v-if="type === 'bottom'">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  isPulling?: boolean
  pullDistance?: number
  isLoading?: boolean
  isLoadingMore?: boolean
  type?: 'top' | 'bottom'
}>(), {
  pullDistance: 0,
  isPulling: false,
  isLoading: false,
  isLoadingMore: false,
  type: 'top'
})

const text = computed(() => {
  if (props.isLoading) return '正在加载...'
  return '加载更多'
})
</script>

<style scoped lang="scss">
.pull-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 10;
}

.pull-indicator.type-bottom {
  position: relative;
  top: auto;
  height: auto;
  background: none;
  margin-top: 10px;
}

.pull-content {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  transition: transform 0.1s ease;
}

.type-bottom .pull-content {
  padding: 16px 0;
}

.arrow {
  width: 28px;
  height: 28px;
  transition: transform 0.2s ease;
  
  svg {
    width: 100%;
    height: 100%;
    fill: #165dff;
  }
}

.is-pulling .arrow {
  transform: rotate(180deg);
}

.spinner {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.default-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e5e5e5;
  border-top-color: #165dff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.2);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
