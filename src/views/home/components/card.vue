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
  border-radius: 16px;
  transition: all var(--transition-duration) ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
  box-shadow:
    0 4px 16px var(--color-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  background: inherit;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 8px 24px var(--color-shadow-hover),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
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
    }

    .tag {
      font-size: 12px;
      font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 500;
      @include card-tag;
    }
  }

  .content {
    flex: 1;
    font-size: 16px;
    line-height: 1.7;
    margin-bottom: 24px;
    font-weight: 500;
    font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
    @include card-content;
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
        font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
        @include card-text;

        :deep(svg) {
          opacity: 0.7;
          color: var(--card-text-color);
        }
      }
    }

    .username {
      font-size: 14px;
      font-weight: 700;
      font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
      @include card-username;
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
