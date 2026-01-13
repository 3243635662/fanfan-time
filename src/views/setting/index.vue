<template>
  <div class="setting-page">
    <div class="setting-container">
      <div class="page-header">
        <h1>系统设置</h1>
        <p>自定义您的使用体验</p>
      </div>

      <a-tabs default-active-key="appearance" class="setting-tabs">
        <a-tab-pane key="appearance" title="外观">



          <div class="setting-section">
            <h3>主题设置</h3>
            <div class="setting-item">
              <div class="item-info">
                <AppIcon
                  :name="isDark ? 'line-md:moon-rising-twotone-loop' : 'line-md:moon-filled-to-sunny-filled-loop-transition'"
                  size="22" />
                <div class="item-text">
                  <span class="item-title">{{ isDark ? '深色主题' : '浅色主题' }}</span>
                  <span class="item-desc">切换主题</span>
                </div>
              </div>
              <a-switch v-model="isDark" @change="handleDarkModeChange" />
            </div>
          </div>

          <div class="setting-section">
            <h3>字体设置</h3>
            <div class="setting-item">
              <div class="item-info">
                <AppIcon name="mdi:format-font" size="22" />
                <div class="item-text">
                  <span class="item-title">选择字体</span>
                  <span class="item-desc">自定义界面字体</span>
                </div>
              </div>
              <a-select v-model="currentFont" :options="fontOptions" style="width: 200px" @change="handleFontChange" />
            </div>

            <div class="setting-item">
              <div class="item-info">
                <AppIcon name="mdi:format-size" size="22" />
                <div class="item-text">
                  <span class="item-title">字体大小</span>
                  <span class="item-desc">调整界面文字大小</span>
                </div>
              </div>
              <div class="font-size-controls">
                <a-button-group>
                  <a-button @click="decreaseFontSize" :disabled="fontSize <= 12">
                    <AppIcon name="mdi:minus" size="16" />
                  </a-button>
                  <span class="font-size-display">{{ fontSize }}px</span>
                  <a-button @click="increaseFontSize" :disabled="fontSize >= 20">
                    <AppIcon name="mdi:plus" size="16" />
                  </a-button>
                </a-button-group>
              </div>
            </div>

            <div class="font-preview">
              <span class="preview-label">预览效果：</span>
              <span class="preview-text" :style="{ fontFamily: currentFontFamily }">
                这是一段示例文字，用于预览字体效果
              </span>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="display" title="显示">
          <div class="setting-section">
            <h3>光标效果</h3>
            <div class="setting-item">
              <div class="item-info">
                <AppIcon name="mdi:cursor-default" size="22" />
                <div class="item-text">
                  <span class="item-title">显示首页鼠标光标</span>
                  <span class="item-desc">在首页显示跟随鼠标的文字光标效果</span>
                </div>
              </div>
              <a-switch v-model="isShowTextCursor" @change="handleTextCursorChange" />
            </div>
          </div>

          <div class="setting-section">
            <h3>页面标题</h3>
            <div class="setting-item">
              <div class="item-info">
                <AppIcon name="mdi:format-title" size="22" />
                <div class="item-text">
                  <span class="item-title">Dock标题</span>
                  <span class="item-desc">设置首页显示的标题文字</span>
                </div>
              </div>
              <a-input v-model="newDockTitle" placeholder="输入标题" style="width: 200px" @blur="handleDockTitleChange"
                :max-length="30" />
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="account" title="账户">
          <div class="account-container" v-if="isLogin">
            <div class="setting-section account-info-section">
              <h3>账户信息</h3>
              <div class="account-info">
                <FanAvatar
                  :imageUrl="userInfo?.avatar"
                  :size="80"
                  :username="userInfo?.username || 'fanfan'"
                  class="account-avatar"
                />
                <div class="account-details">
                  <div class="account-name-group">
                    <span class="account-name">{{ userInfo?.nickname || userInfo?.username || 'fanfan' }}</span>
                    <span class="account-username" v-if="userInfo?.nickname">@{{ userInfo?.username || 'fanfan' }}</span>
                  </div>
                  <span class="account-email">{{ userInfo?.email || 'fanfan@fanfan-time.com' }}</span>
                  <div class="account-meta">
                    <span class="account-date">注册于 {{ formatDate(userInfo?.createdAt) || '2024年1月13日' }}</span>
                    <span class="account-roles" v-if="userInfo?.roles?.length">• {{ userInfo.roles.join(', ') }}</span>
                  </div>
                  <div class="account-status" v-if="userInfo?.tokenStatus">
                    <span class="status-label">状态:</span>
                    <span class="status-value" :class="getStatusClass(userInfo.tokenStatus)">
                      {{ getStatusText(userInfo.tokenStatus) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="setting-section account-actions-section">
              <h3>账户操作</h3>
              <div class="action-buttons">
                <a-button type="primary" danger @click="handleLogout" size="large">
                  <AppIcon name="mdi:logout" size="18" />
                  退出登录
                </a-button>
              </div>
            </div>
          </div>

          <div v-else>
          <a-empty  description="未登录">
        <template #image>
                  <AppIcon name="line-md:watch-off-twotone" size="64" />
          </template>
              <router-link to="/login">
                <a-button type="primary">去登录</a-button>
              </router-link>
            </a-empty>
            </div>
        </a-tab-pane>

        <a-tab-pane key="about" title="关于">
          <div class="setting-section">
            <h3>关于fan时光</h3>
            <div class="about-info">
              <div class="about-logo">
                <AppIcon name="line-md:emoji-smile" size="64" />
              </div>
              <div class="about-text">
                <h4>fan时光</h4>
                <p>版本 1.0.0</p>
                <p class="about-desc">
                  一个优雅的留言平台，用于记录生活中的美好时刻。
                </p>
              </div>
            </div>

            <div class="about-links">
              <a-link href="https://github.com/3243635662" target="_blank">
                <AppIcon name="mdi:github" size="18" />
                GitHub
              </a-link>
              <a-link href="https://fanblog.top" target="_blank">
                <AppIcon name="mdi:web" size="18" />
                官方网站
              </a-link>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useSettingStore } from "@/store/setting";
import { useAuthStore } from "@/store/auth";
import { $message } from "@/hooks/useMessage";
import AppIcon from "@/components/AppIcon.vue";
import FanAvatar from "@/views/home/components/Fan-Avatar.vue";
import { STORAGE_KEYS, APP_PREFIX } from "@/utils/constants";
const newDockTitle = ref("");
const router = useRouter();
const settingStore = useSettingStore();
const authStore = useAuthStore();
const { isLogin, userInfo } = storeToRefs(authStore);
const { isDark, isShowTextCursor } = storeToRefs(settingStore);

const fontOptions = [
  { value: "default", label: "系统默认", family: "'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
  { value: "serif", label: "衬线体", family: "'Georgia', 'Times New Roman', serif" },
  { value: "mono", label: "等宽字体", family: "'Fira Code', 'Consolas', 'Courier New', monospace" },
  { value: "qingyun", label: "清韵文楷", family: "'清韵文楷', 'QingYunWenKai', 'KaiTi', sans-serif" },
  { value: "songti", label: "宋体", family: "'SimSun', 'Songti SC', serif" },
  { value: "heiti", label: "黑体", family: "'SimHei', 'Heiti SC', sans-serif" },
];

const currentFont = ref("default");
const fontSize = ref(16);

const currentFontFamily = computed(() => {
  const selected = fontOptions.find((opt) => opt.value === currentFont.value);
  return selected?.family || fontOptions[0]?.family || "'Inter', sans-serif";
});

const applyFontToGlobal = () => {
  document.documentElement.style.setProperty("--font-family", currentFontFamily.value);
  localStorage.setItem(`${APP_PREFIX}:${STORAGE_KEYS.PREFERRED_FONT}`, currentFont.value);
};

const applyFontSizeToGlobal = () => {
  document.documentElement.style.setProperty("--font-size-base", `${fontSize.value}px`);
};

const applyThemeToGlobal = (isDarkMode: boolean) => {
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
  } else {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
  }
};

onMounted(() => {
  const storedFont = localStorage.getItem(`${APP_PREFIX}:${STORAGE_KEYS.PREFERRED_FONT}`);
  const storedFontSize = localStorage.getItem(`${APP_PREFIX}:${STORAGE_KEYS.PREFERRED_FONT_SIZE}`);
  const storedIsDark = localStorage.getItem(`${APP_PREFIX}:${STORAGE_KEYS.IS_DARK_MODE}`);

  if (storedFont) {
    currentFont.value = storedFont;
    applyFontToGlobal();
  }
  if (storedFontSize) {
    fontSize.value = parseInt(storedFontSize, 10);
    applyFontSizeToGlobal();
  }
  
  // 初始化主题设置
  const isDarkMode = storedIsDark === "true";
  settingStore.isDark = isDarkMode;
  applyThemeToGlobal(isDarkMode);

});

const handleDarkModeChange = (value: string | number | boolean) => {
  const isDarkMode = Boolean(value);
  settingStore.isDark = isDarkMode; // 确保store中的状态也更新
  applyThemeToGlobal(isDarkMode);
  localStorage.setItem(`${APP_PREFIX}:${STORAGE_KEYS.IS_DARK_MODE}`, String(isDarkMode));
  
  // 强制重新应用背景样式
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};

const handleFontChange = (value: string) => {
  currentFont.value = value;
  applyFontToGlobal();
};

const handleTextCursorChange = () => {
  $message.success("切换成功");
};

// 处理首页Dock名称变化
const handleDockTitleChange = () => {
  if (newDockTitle.value.trim()) {
    settingStore.setDockTitle(newDockTitle.value.trim());
    newDockTitle.value = "";
    $message.success("首页Dock名称已更新");
  }
};

const decreaseFontSize = () => {
  if (fontSize.value > 12) {
    fontSize.value--;
    localStorage.setItem(`${APP_PREFIX}:${STORAGE_KEYS.PREFERRED_FONT_SIZE}`, String(fontSize.value));
    document.documentElement.style.fontSize = `${fontSize.value}px`;
  }
};

const increaseFontSize = () => {
  if (fontSize.value < 20) {
    fontSize.value++;
    localStorage.setItem(`${APP_PREFIX}:${STORAGE_KEYS.PREFERRED_FONT_SIZE}`, String(fontSize.value));
    document.documentElement.style.fontSize = `${fontSize.value}px`;
  }
};

// 格式化日期
const formatDate = (date: Date | string | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 获取状态样式类
const getStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'status-active';
    case 'inactive':
      return 'status-inactive';
    case 'expired':
      return 'status-expired';
    default:
      return 'status-default';
  }
};

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return '活跃';
    case 'inactive':
      return '未激活';
    case 'expired':
      return '已过期';
    default:
      return '未知';
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.setting-page {
  padding: 0 $padding-24 $padding-24;
  background: var(--color-bg-primary);
  transition: background-color var(--transition-duration) ease;
  min-height: 100vh;
  position: relative;
  z-index: 100; // 确保在背景视频之上
}

// 深色模式下的纯黑色背景
body.dark-mode .setting-page {
  background: #000000 !important;
}



.setting-container {
  max-width: 900px;
  margin: 0 auto;
  background: var(--color-bg-card);
  border-radius: $radius-16;
  box-shadow: 0 8px 32px var(--color-shadow);

  .page-header {
    text-align: center;
    margin: $padding-24 0;

    h1 {
      font-size: $font-size-28;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 $padding-8;
    }

    p {
      font-size: $font-size-14;
      color: var(--color-text-tertiary);
      margin: 0;
    }
  }

  .setting-tabs {
    background: transparent;
    border-radius: $radius-16;
    padding: $padding-24;
    transition: all var(--transition-duration) ease;

    :deep(.arco-tabs-nav) {
      margin-bottom: $padding-24;
    }

    :deep(.arco-tabs-tab) {
      font-size: $font-size-14;
      color: var(--color-text-secondary);

      &:hover {
        color: $primary;
      }
    }

    :deep(.arco-tabs-tab-active) {
      color: $primary;
    }
  }
}

.setting-section {
  margin-bottom: $padding-24;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    font-size: $font-size-16;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 $padding-16;
    padding-bottom: $padding-12;
    border-bottom: 1px solid var(--color-border);
    transition: all var(--transition-duration) ease;
  }
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $padding-16 0;
  border-bottom: 1px solid var(--color-border-light);
  transition: all var(--transition-duration) ease;

  &:last-child {
    border-bottom: none;
  }

  .item-info {
    display: flex;
    align-items: center;
    gap: $padding-16;

    .item-text {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .item-title {
        font-size: $font-size-14;
        font-weight: 500;
        color: var(--color-text-primary);
      }

      .item-desc {
        font-size: $font-size-12;
        color: var(--color-text-tertiary);
      }
    }
  }
}

.font-size-controls {
  display: flex;
  align-items: center;
  gap: $padding-8;

  .font-size-display {
    min-width: 50px;
    text-align: center;
    font-size: $font-size-14;
    font-weight: 500;
    color: var(--color-text-primary);
  }
}

.font-preview {
  margin-top: $padding-16;
  padding: $padding-16;
  background: var(--color-bg-tertiary);
  border-radius: $radius-8;
  transition: all var(--transition-duration) ease;

  .preview-label {
    font-size: $font-size-12;
    color: var(--color-text-tertiary);
    margin-right: $padding-8;
  }

  .preview-text {
    font-size: $font-size-14;
    color: var(--color-text-primary);
  }
}

.account-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 32px 0;
  min-height: 60vh;
}

.account-info-section {
  width: 100%;
  max-width: 400px;
  text-align: center;
  
  h3 {
    margin-bottom: 24px;
    font-size: 18px;
    font-weight: 600;
  }
}

.account-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  background: var(--color-bg-secondary);
  border-radius: 16px;
  box-shadow: 0 2px 8px var(--color-shadow);



  .account-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-align: center;
    width: 100%;

    .account-name-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      .account-name {
        font-size: 20px;
        font-weight: 700;
        color: var(--color-text-primary);
      }

      .account-username {
        font-size: 14px;
        color: var(--color-text-secondary);
        font-weight: 500;
      }
    }

    .account-email {
      font-size: 14px;
      color: var(--color-text-secondary);
      font-weight: 500;
      padding: 8px 12px;
      background: var(--color-bg-tertiary);
      border-radius: 8px;
      border: 1px solid var(--color-border-light);
    }

    .account-meta {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 12px;
      color: var(--color-text-tertiary);
      
      .account-date {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .account-roles {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        color: var(--color-primary);
        font-weight: 500;
      }
    }

    .account-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--color-bg-tertiary);
      border-radius: 8px;
      border: 1px solid var(--color-border-light);
      font-size: 12px;

      .status-label {
        color: var(--color-text-secondary);
        font-weight: 500;
      }

      .status-value {
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;

        &.status-active {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        &.status-inactive {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        &.status-expired {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        &.status-default {
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
        }
      }
    }
  }
}

.account-actions-section {
  width: 100%;
  max-width: 400px;
  text-align: center;
  
  h3 {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 600;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}

.about-info {
  display: flex;
  align-items: center;
  gap: $padding-24;
  padding: $padding-24;
  background: var(--color-bg-tertiary);
  border-radius: $radius-12;
  margin-bottom: $padding-16;
  transition: all var(--transition-duration) ease;


  .about-text {
    h4 {
      font-size: $font-size-20;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 4px;
    }

    p {
      font-size: $font-size-14;
      color: var(--color-text-secondary);
      margin: 0 0 4px;

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    .about-desc {
      font-size: $font-size-12;
      color: var(--color-text-tertiary);
    }
  }
}

.about-links {
  display: flex;
  gap: $padding-24;

  :deep(.arco-link) {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: $font-size-14;
    color: var(--color-text-secondary);

    &:hover {
      color: $primary;
    }
  }
}

@media (max-width: $mobile) {
  .setting-page {
    padding: $padding-16;
  }

  .setting-container .setting-tabs {
    padding: $padding-16;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: $padding-12;
  }

  .account-info {
    flex-direction: column;
    text-align: center;
  }

  .about-info {
    flex-direction: column;
    text-align: center;
  }

  .about-links {
    flex-direction: column;
    align-items: center;
    gap: $padding-12;
  }
}
</style>
