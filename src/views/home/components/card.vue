<template>
  <div class="container" :class="containerClass">
    <div class="head">
      <span class="time">{{ formatTime(item.time) }}</span>
      <span class="tag">{{ item.tag }}</span>
    </div>
    <div class="content">{{ item.content }}</div>
    <div class="footer">
      <div class="left-stats">
        <span class="liked-count">
          <AppIcon name="mdi:cards-heart" size="18" />
          {{ item.likedCount }}
        </span>
        <span class="comment-count">
          <AppIcon name="mdi:comment-processing" size="18" />
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
import { formatTime } from "@/utils";
const props = defineProps({
  item: {
    type: Object as () => MessageType,
    default: () => ({
      backgroundColor: '#efe4fd',
      time: new Date(),
      tag: '留言',
      content: '这是条默认的留言内容',
      likedCount: 99,
      commentCount: 99,
      username: '繁繁'
    })
  }
})

// 根据背景色生成对应的 CSS 类名
const containerClass = computed(() => {
  const colorMap: Record<string, string> = {
    '#ebd4d0': 'card-rose',
    '#efe4fd': 'card-lavender',
    '#cbe4e9': 'card-sky',
    '#fef6de': 'card-cream',
    '#e2f7d9': 'card-mint',
    '#ffffff': 'card-white'
  };
  return colorMap[props.item.backgroundColor] || 'card-default';
});
</script>

<style lang="scss" scoped>
@use "@/styles/_mixins.scss" as *;

@font-face {
  font-family: '清韵文楷';
  src: url('@/assets/font/清韵文楷.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.container {
  cursor: pointer;
  padding: 24px;
  border-radius: 20px;
  transition: all var(--transition-duration) ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
  box-shadow:
    0 8px 32px var(--color-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.18);
  position: relative;
  background: var(--card-bg-color, inherit);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
    border-radius: inherit;
  }

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow:
      0 16px 48px var(--color-shadow-hover),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    
    &::before {
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.15) 0%,
        rgba(255, 255, 255, 0.08) 50%,
        rgba(255, 255, 255, 0) 100%
      );
    }
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
      color: var(--card-text-color);
      opacity: 0.8;
      transition: opacity var(--transition-duration) ease;
    }

    .tag {
      font-size: 12px;
      font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
      padding: 6px 14px;
      border-radius: 16px;
      font-weight: 500;
      @include card-tag;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  .content {
    flex: 1;
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 24px;
    font-weight: 500;
    font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
    @include card-content;
    opacity: 0.9;
    transition: opacity var(--transition-duration) ease;
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
        gap: 6px;
        font-size: 13px;
        font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
        @include card-text;
        opacity: 0.8;
        transition: all var(--transition-duration) ease;

        &:hover {
          opacity: 1;
          transform: translateY(-1px);
        }

        :deep(svg) {
          opacity: 0.8;
          color: var(--card-text-color);
          transition: all var(--transition-duration) ease;
        }
      }
    }

    .username {
      font-size: 14px;
      font-weight: 600;
      font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
      @include card-username;
      opacity: 0.9;
      transition: opacity var(--transition-duration) ease;
    }
  }
}

// 卡片主题颜色样式
.card-rose {
  background-color: var(--card-bg-rose);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.card-lavender {
  background-color: var(--card-bg-lavender);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.card-sky {
  background-color: var(--card-bg-sky);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.card-cream {
  background-color: var(--card-bg-cream);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.card-mint {
  background-color: var(--card-bg-mint);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.card-white {
  background-color: var(--card-bg-white);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.card-default {
  background-color: var(--card-bg-white);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
