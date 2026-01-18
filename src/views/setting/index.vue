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
                <a-upload accept="image/*" :show-file-list="false" :auto-upload="false" @change="onAvatarSelect">
                  <template #upload-button>
                    <div class="avatar-upload-wrapper" :style="{ cursor: isUploading ? 'wait' : 'pointer' }">
                      <FanAvatar
                        :imageUrl="userInfo?.avatar"
                        :size="80"
                        :username="userInfo?.username || 'fanfan'"
                        class="account-avatar"
                      />
                      <div class="avatar-upload-mask" v-if="!isUploading">
                        <AppIcon name="mdi:camera" size="24" />
                        <span>更换头像</span>
                      </div>
                      <div class="avatar-upload-loading" v-else>
                        <AppIcon name="mdi:loading" size="24" class="spinning" />
                        <span>上传中...</span>
                      </div>
                    </div>
                  </template>
                </a-upload>
                <div class="avatar-upload-tip">
                  <div>
                    <AppIcon name="mdi:information-outline" size="12" />
                    <p>点击头像进行上传</p>
                  </div>
                  <div>
                    <AppIcon name="mdi:information-outline" size="12" />
                    <p>使用360图床存储,请勿上传违法图片！！！</p>
                  </div>
                </div>
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
            <a-empty description="未登录">
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
import { useSettingStore } from "@/store/setting";
import { useAuthStore } from "@/store/auth";
import { $message } from "@/hooks/useMessage";
import AppIcon from "@/components/AppIcon.vue";
import FanAvatar from "@/views/home/components/Fan-Avatar.vue";
import { STORAGE_KEYS, APP_PREFIX } from "@/utils/constants";
import type { FileItem } from '@arco-design/web-vue';

// 京东图床API配置
const imageHostingURL = 'https://api.xinyew.cn/api/360tc';

const newDockTitle = ref("");
const settingStore = useSettingStore();
const authStore = useAuthStore();
const { isLogin, userInfo } = storeToRefs(authStore);
const { isDark, isShowTextCursor } = storeToRefs(settingStore);
const isUploading = ref(false);

const fontOptions = [
  { value: "default", label: "系统默认", family: "'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
  { value: "serif", label: "衬线体", family: "'Georgia', 'Times New Roman', serif" },
  { value: "mono", label: "等宽字体", family: "'Fira Code', 'Consolas', 'Courier New', monospace" },
  { value: "qingyun", label: "清韵文楷", family: "'清韵文楷', 'QingYunWenKai', 'KaiTi', sans-serif" },
  { value: "songti", label: "宋体", family: "'SimSun', 'Songti SC', serif" },
  { value: "heiti", label: "黑体", family: "'SimHei', 'Heiti SC', sans-serif" },
];

// 清理URL，移除可能存在的查询参数
const cleanUrl = (url: string): string => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
  } catch {
    return url;
  }
};

// 头像上传处理 - 使用京东图床接口
async function onAvatarSelect(fileList: FileItem[]) {
  const file = fileList[0];
  if (!file || !file.file) return;

  // 文件大小检查 (限制 5MB)
  if (file.file.size > 5 * 1024 * 1024) {
    $message.error('头像文件大小不能超过 5MB');
    return;
  }

  // 文件类型检查
  if (!file.file.type.startsWith('image/')) {
    $message.error('请选择图片文件');
    return;
  }

  // 防止重复上传
  if (isUploading.value) return;

  try {
    isUploading.value = true;

    const formData = new FormData();
    formData.append('file', file.file);

    const uploadResponse = await fetch(imageHostingURL, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`图床上传失败: HTTP ${uploadResponse.status}`);
    }

    const uploadResult = await uploadResponse.json();

    if (!uploadResult || uploadResult.errno !== 0 || !uploadResult.data?.url) {
      throw new Error(uploadResult.message || '图床返回数据格式错误');
    }

    const cleanedUrl = cleanUrl(uploadResult.data.url);
    const timestamp = new Date().getTime();
    const finalUrl = cleanedUrl.includes('?')
      ? `${cleanedUrl}&t=${timestamp}` 
      : `${cleanedUrl}?t=${timestamp}`;

    const { saveImageHostingUrlAPI } = await import('@/api/auth');
    const saveResponse = await saveImageHostingUrlAPI(finalUrl);

    if (saveResponse.code === 0) {
      if (userInfo.value) {
        userInfo.value.avatar = finalUrl;
      }
      
      localStorage.setItem(`${APP_PREFIX}:${STORAGE_KEYS.USER}`, JSON.stringify(userInfo.value));
      $message.success('头像上传成功！');
    } else {
      throw new Error(saveResponse.message || '保存头像URL失败');
    }

  } catch (error) {
    $message.error(`头像上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
  } finally {
    isUploading.value = false;
  }
}

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
  document.body.classList.toggle("dark-mode", isDarkMode);
  document.body.classList.toggle("light-mode", !isDarkMode);
};

onMounted(() => {
  const storedFont = localStorage.getItem(`${APP_PREFIX}:${STORAGE_KEYS.PREFERRED_FONT}`);
  const storedFontSize = localStorage.getItem(`${APP_PREFIX}:${STORAGE_KEYS.PREFERRED_FONT_SIZE}`);
  const storedIsDark = localStorage.getItem(`${APP_PREFIX}:${STORAGE_KEYS.IS_DARK_MODE}`);

  if (storedIsDark !== null) {
    const isDarkMode = storedIsDark === "true";
    settingStore.isDark = isDarkMode;
    applyThemeToGlobal(isDarkMode);
  }

  if (storedFont) {
    currentFont.value = storedFont;
    applyFontToGlobal();
  }
  if (storedFontSize) {
    fontSize.value = parseInt(storedFontSize, 10);
    applyFontSizeToGlobal();
  }
});

const handleDarkModeChange = (value: string | number | boolean) => {
  const isDarkMode = Boolean(value);
  settingStore.isDark = isDarkMode;
  localStorage.setItem(`${APP_PREFIX}:${STORAGE_KEYS.IS_DARK_MODE}`, String(isDarkMode));
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

const formatDate = (date: Date | string | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getStatusClass = (status: string) => `status-${status}`;

const statusTextMap: Record<string, string> = {
  active: '活跃',
  inactive: '未激活',
  valid: '有效'
};

const getStatusText = (status: string) => statusTextMap[status] || '未知';

const handleLogout = () => {
  authStore.logout();
};
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.avatar-upload-wrapper {
  position: relative;
  cursor: pointer;
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;

  .account-avatar {
    display: block;
  }

  .avatar-upload-mask {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
    font-size: 12px;
    gap: 4px;
  }

  .avatar-upload-loading {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    gap: 4px;
  }

  &:hover .avatar-upload-mask {
    opacity: 1;
  }

  .spinning {
    animation: spin 1s linear infinite;
  }
}

.avatar-upload-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #f59e0b;
  text-align: center;

   div {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  p {
    margin: 0;
    padding: 0;
  }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }


.setting-page {
  padding: 0 $padding-24 $padding-24;
  background: var(--color-bg-primary);
  transition: background-color var(--transition-duration) ease;
  min-height: 100vh;
  position: relative;
  z-index: 100;
}

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
