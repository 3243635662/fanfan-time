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
import type { messageType } from "@/types/home";
import AppIcon from "@/components/AppIcon.vue";
import { computed } from "vue";

const props = defineProps({
  backgroundColor: {
    type: String,
    default: '#efe4fd'
  },
  item: {
    type: Object as () => messageType,
    default: () => ({
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
    backgroundColor: hexToRgba(props.backgroundColor, 0.45), // More transparent
    backdropFilter: 'blur(20px)', // Increased blur for better readability with higher transparency
    WebkitBackdropFilter: 'blur(20px)',
  }
});
</script>

<style lang="scss" scoped>
.container {
  padding: 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .time {
      font-size: 12px;
      color: #666;
    }

    .tag {
      font-size: 12px;
      color: #888;
    }
  }

  .content {
    flex: 1;
    font-size: 16px;
    color: #333;
    line-height: 1.6;
    margin-bottom: 24px;
    font-weight: 500;
    font-family: system-ui, -apple-system, sans-serif;
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
        
        :deep(svg) {
          opacity: 0.5;
        }
      }
    }

    .username {
      font-size: 14px;
      font-weight: 700;
      color: #333;
    }
  }
}
</style>
