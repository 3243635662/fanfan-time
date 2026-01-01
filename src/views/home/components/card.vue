<template>
  <div class="container" :style="backgroundStyle">
    <div class="head">
      <span class="time" :style="textColorStyle">{{ item.time }}</span>
      <span class="tag" :style="tagColorStyle">{{ item.tag }}</span>
    </div>
    <div class="content" :style="contentColorStyle">{{ item.content }}</div>
    <div class="footer">
      <div class="left-stats">
        <span class="liked-count" :style="textColorStyle">
          <AppIcon name="mdi:cards-heart" size="18" />
          {{ item.likedCount }}
        </span>
        <span class="comment-count" :style="textColorStyle">
          <AppIcon name="mdi:comment-processing" size="18" />
          {{ item.commentCount }}
        </span>
      </div>
      <span class="username" :style="usernameColorStyle">{{ item.username }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MessageType } from "@/types";
import AppIcon from "@/components/AppIcon.vue";
import { computed } from "vue";
import { useSettingStore } from "@/store/setting";
import { storeToRefs } from "pinia";

const props = defineProps({
  item: {
    type: Object as () => MessageType,
    default: () => ({
      backgroundColor: '#efe4fd',
      time: '2025-12-11',
      tag: '留言',
      content: 'jiayi udhwuida',
      likedCount: 2,
      commentCount: 3,
      username: '2769566671'
    })
  }
})

const settingStore = useSettingStore();
const { isDark } = storeToRefs(settingStore);

// 深色模式颜色映射
const darkModeColorMap: Record<string, string> = {
  '#ebd4d0': '#8b6f67', // 玫瑰粉 → 深棕粉
  '#efe4fd': '#6b5d9e', // 淡紫 → 深紫
  '#cbe4e9': '#5a8c94', // 天蓝 → 深蓝绿
  '#fef6de': '#9e8f5f', // 奶油 → 深黄褐
  '#e2f7d9': '#638f57', // 薄荷绿 → 深绿
  '#ffffff': '#333333'  // 默认白色 → 深灰
};

// 获取主题颜色
const getThemeColor = (color: string) => {
  if (isDark.value && darkModeColorMap[color]) {
    return darkModeColorMap[color];
  }
  return color;
};

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
  const themeColor = getThemeColor(props.item.backgroundColor);
  return {
    backgroundColor: hexToRgba(themeColor, isDark.value ? 0.85 : 0.75),
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: isDark.value ? '#ffffff' : '#1a1a1a',
  }
});

const textColorStyle = computed(() => {
  return {
    color: isDark.value ? '#ffffff' : 'rgba(0, 0, 0, 0.6)',
  };
});

const contentColorStyle = computed(() => {
  return {
    color: isDark.value ? '#ffffff' : '#1a1a1a',
    textShadow: isDark.value ? '0 1px 2px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(255, 255, 255, 0.3)',
  };
});

const tagColorStyle = computed(() => {
  return {
    color: isDark.value ? '#ffffff' : 'rgba(0, 0, 0, 0.7)',
    background: isDark.value ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)',
  };
});

const usernameColorStyle = computed(() => {
  return {
    color: isDark.value ? '#ffffff' : 'rgba(0, 0, 0, 0.85)',
  };
});
</script>

<style lang="scss" scoped>
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
  transition: all 0.3s ease;
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
      color: rgba(0, 0, 0, 0.6);
    }

    .tag {
      font-size: 12px;
      font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
      padding: 4px 12px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      color: rgba(0, 0, 0, 0.7);
      font-weight: 500;
    }
  }

  .content {
    flex: 1;
    font-size: 16px;
    color: #1a1a1a;
    line-height: 1.7;
    margin-bottom: 24px;
    font-weight: 500;
    font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
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
        color: rgba(0, 0, 0, 0.6);
        font-family: '清韵文楷', system-ui, -apple-system, sans-serif;

        :deep(svg) {
          opacity: 0.7;
        }
      }
    }

    .username {
      font-size: 14px;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.85);
      font-family: '清韵文楷', system-ui, -apple-system, sans-serif;
    }
  }
}
</style>
