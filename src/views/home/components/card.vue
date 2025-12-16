<template>
  <div class="container" :style="backgroundStyle">
    <!-- 发布时间 -->
    <div class="head">
      <span class="time">{{ item.time }}</span>
      <span class="tag">{{ item.tag }}</span>
    </div>
    <div class="content">{{ item.content }}</div>
    <div class="footer">
      <div class="left-stats">
        <span class="liked-count">
          <AppIcon name="mdi:cards-heart" size="18" color="#666" />
          {{ item.likedCount }}
        </span>
        <span class="comment-count">
          <AppIcon name="mdi:comment-processing" size="18" color="#666" />
          {{ item.commentCount }}
        </span>
      </div>
      <span class="username">{{ item.username }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MessageType } from "@/types";
import AppIcon from "@/components/AppIcon.vue";
import { computed } from "vue";

const props = defineProps({
  item: {
    type: Object as () => MessageType,
    default: () => ({
      backgroundColor:'#efe4fd',
      time: '2025-12-11',
      tag: '留言',
      content: 'jiayi udhwuida',
      likedCount: 2,
      commentCount: 3,
      username: '2769566671'
    })
  }
})

const hexToRgba = (hex: string, alpha: number) => {
  let c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
  }
  return hex;
}

const backgroundStyle = computed(() => {
  return {
    backgroundColor: hexToRgba(props.item.backgroundColor, 0.45), 
    backdropFilter: 'blur(1px)', // 增加模糊效果
    WebkitBackdropFilter: 'blur(1px)', // Safari兼容
  }
});
</script>

<style lang="scss" scoped>
// 引入iconfont字体
@font-face {
  font-family: '清韵文楷';
  src: url('@/assets/font/清韵文楷.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap; // 提高加载性能
}
.container {
  cursor: pointer;
  padding: 24px;
  border-radius: 16px;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.18);
  overflow: hidden;
  position: relative;
  

  &:hover {
    transform: translateY(-4px);
  }


  > * {
    position: relative;
    z-index: 2;
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .time {
      font-size: 12px;
      font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
    }

    .tag {
      font-size: 12px;
      font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
    }
  }

  .content {
    flex: 1;
    font-size: 16px;
    color: #333;
    line-height: 1.6;
    margin-bottom: 24px;
    font-weight: 500;
    font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left-stats {
      display: flex;
      gap: 16px;

      span {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: #666;
        font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
        
        :deep(svg) {
          opacity: 0.5;
        }
      }
    }

    .username {
      font-size: 14px;
      font-weight: 700;
      color: rgba(51, 51, 51, 0.95); // 稍微降低文字不透明度
      font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
    }
  }
}
</style>
