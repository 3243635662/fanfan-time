<template>
  <div class="login-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <a-button
        type="text"
        size="large"
        class="home-button"
        @click="$router.push('/')"
      >
        <AppIcon name="mdi:home" size="20" />
        返回首页
      </a-button>
      <a-button
        type="text"
        size="large"
        class="theme-toggle"
        @click="toggleDarkMode"
      >
        <AppIcon
          :name="isDark ? 'line-md:moon-rising-twotone-loop' : 'line-md:moon-filled-to-sunny-filled-loop-transition'"
          size="20"
        />
        {{ isDark ? '夜间' : '白天' }}
      </a-button>
    </div>

    <div class="login-container">
      <div class="login-header">
        <AppIcon
          name="line-md:emoji-smile"
          size="48"
          class="logo-icon"
          :color="isDark ? '#fff' : null"
        />
        <h1>欢迎回来</h1>
        <p class="subtitle">登录fan时光，记录美好时刻</p>
      </div>

      <a-form :model="formData" layout="vertical" @submit="handleLogin" class="login-form">
        <a-form-item field="username" :rules="usernameRules" :validate-trigger="['blur', 'change']">
          <a-input v-model="formData.username" placeholder="用户名" size="large" allow-clear>
            <template #prefix>
              <AppIcon name="mdi:user-outline" size="18" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item field="password" :rules="passwordRules" :validate-trigger="['blur', 'change']">
          <a-input-password v-model="formData.password" placeholder="密码" size="large" allow-clear>
            <template #prefix>
              <AppIcon name="mdi:lock-outline" size="18" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <div class="form-options">
            <a-checkbox v-model="formData.remember">记住我</a-checkbox>
            <a-link>忘记密码？</a-link>
          </div>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="isLoading"
            long
            class="login-button"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>

      <a-divider orientation="center" class="divider">
        <span class="divider-text">其他方式</span>
      </a-divider>

      <div class="social-login">
        <a-button class="social-button" shape="circle" size="large">
          <AppIcon name="mdi:wechat" size="22" color="#07c160" />
        </a-button>
        <a-button class="social-button" shape="circle" size="large">
          <AppIcon name="mdi:github" size="22" />
        </a-button>
        <a-button class="social-button" shape="circle" size="large">
          <AppIcon name="mdi:google" size="22" color="#4285f4" />
        </a-button>
      </div>

      <div class="register-link">
        <span>还没有账号？</span>
        <router-link to="/register">立即注册</router-link>
      </div>
    </div>

      <div class="login-decoration">
        <video
          class="decoration-video"
          src="https://yc.tuchung.cc/uploads/video_cc0283c76e8d449e9dd1f10993f246b5.mp4"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
        ></video>
        <div class="decoration-overlay">
          <div class="decoration-content">
            <div class="animated-title-wrapper">
              <h2 class="animated-title">
                <span>记</span><span>录</span><span>每</span><span>一</span><span>个</span><span>精</span><span>彩</span><span>瞬</span><span>间</span>
              </h2>
              <div class="title-glow"></div>
            </div>
            <div class="animated-subtitle">
              <p class="subtitle-line">分享你的想法，记录你的生活</p>
              <p class="subtitle-line">与朋友一起创造美好的回忆</p>
            </div>
            <div class="floating-elements">
              <div class="floating-element element-1">
                <AppIcon name="mdi:heart" size="24" color="#ff6b6b" />
              </div>
              <div class="floating-element element-2">
                <AppIcon name="mdi:star" size="20" color="#ffd93d" />
              </div>
              <div class="floating-element element-3">
                <AppIcon name="mdi:sparkles" size="18" color="#6bcf7f" />
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { useSettingStore } from "@/store/setting";
import { storeToRefs } from "pinia";
import { $notification } from "@/hooks/useNotification";
import AppIcon from "@/components/AppIcon.vue";
import { useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const settingStore = useSettingStore();
const { isDark } = storeToRefs(settingStore);
const { isLoading } = storeToRefs(authStore);
const toggleDarkMode = () => {
  settingStore.toggleDarkMode();
};

const formData = reactive({
  username: "",
  password: "",
  remember: false,
});

const usernameRules = [
  { required: true, message: "请输入用户名" },
  { minLength: 3, message: "用户名至少需要3个字符" },
];

const passwordRules = [
  { required: true, message: "请输入密码" },
  { minLength: 6, message: "密码至少需要6个字符" },
];

const handleLogin = async () => {
  if (!formData.username || !formData.password) {
    $notification.warning({
      title: '登录失败',
      content: '请填写用户名和密码',
    });
    return;
  }

  try {
    const result = await authStore.login({
      username: formData.username,
      password: formData.password,
      remember: formData.remember,
    });

    if (result.success) {
      $notification.success({
        title: '登录成功',
        content: '欢迎回来！',
      });
      // 登录成功后，跳转到首页
      router.push({ name: 'home' });
    } else {
      $notification.error({
        title: '登录失败',
        content: result.message,
      });
    }
  } catch (error) {
    console.error('登录失败:', error);
    $notification.error({
      title: '登录失败',
      content: error instanceof Error ? error.message : "登录错误",
    });
  }
};

// 组件挂载时初始化认证状态
onMounted(() => {
  authStore.initAuth();
  // 如果已经登录，直接跳转首页
  if (authStore.isLogin) {
    router.push({ name: 'home' });
  }
  // 如果路由带了参数，直接填进表单
  if (route.query.username) formData.username = route.query.username as string;
  if (route.query.password) formData.password = route.query.password as string;
});


</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.login-page {
  display: flex;
  min-height: 100vh;
  max-height: 100vh;
  position: relative;
  transition: all var(--transition-duration) ease-in-out;
}

// 顶部导航栏 - 主题适配
.top-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 $padding-24;
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.35);
  z-index: 100;
  transition: all var(--transition-duration) ease-in-out;

  .home-button,
  .theme-toggle {
    color: rgba(255, 255, 255, 0.95);
    font-weight: 600;
    transition: all var(--transition-duration) ease-in-out;
    &:hover {
      color: $gray-0;
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .home-button {
    margin-right: auto;
  }

  .theme-toggle {
    margin-left: 16px;
  }
}
.login-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: $padding-24;
  max-width: 500px;
  transition: all var(--transition-duration) ease-in-out;
  .dark-mode & {
    background: rgba(0, 0, 0, 0.86);
  }
  .login-header {
    text-align: center;
    margin-bottom: $padding-24;
    transition: color var(--transition-duration) ease-in-out;

    .logo-icon {
      margin-bottom: $padding-16;
      animation: bounce 2s ease-in-out infinite;
    }

    h1 {
      font-size: $font-size-28;
      font-weight: 700;
      margin: 0 0 $padding-8;
    }

    .subtitle {
      font-size: $font-size-14;
      margin: 0;
    }
  }



  .login-form {
    width: 100%;
    max-width: 360px;

    :deep(.arco-form-item) {
      margin-bottom: 0;
    }

    :deep(.arco-input),
    :deep(.arco-input-wrapper) {
      border-radius: $radius-8;
      transition: all var(--transition-duration) ease-in-out;
      
      &::placeholder {
        transition: color var(--transition-duration) ease-in-out;
      }
      
      &:hover {
        :deep(.arco-input-prefix) {
          transition: color var(--transition-duration) ease-in-out;
        }
      }
      
      &:focus-within {
        :deep(.arco-input-prefix) {
          transition: color var(--transition-duration) ease-in-out;
        }
      }
      
      :deep(.arco-input-prefix) {
        transition: color var(--transition-duration) ease-in-out;
      }
      
      :deep(.arco-input-suffix) {
        transition: color var(--transition-duration) ease-in-out;
      }
    }
    
    // 错误状态
    :deep(.arco-input-wrapper.arco-input-error),
    :deep(.arco-form-item-error) {
      :deep(.arco-input),
      :deep(.arco-input-wrapper) {
        transition: all var(--transition-duration) ease-in-out;
      }
    }

    :deep(.arco-btn-primary) {
      border: none;
      border-radius: $radius-8;
      height: 48px;
      font-size: $font-size-16;
      font-weight: 600;
      transition: all var(--transition-duration) ease-in-out;
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    :deep(.arco-checkbox) {
      transition: color var(--transition-duration) ease-in-out;
    }
    :deep(.arco-link) {
      transition: color var(--transition-duration) ease-in-out;
    }
    :deep(.arco-checkbox-label) {
      transition: color var(--transition-duration) ease-in-out;
      .dark-mode & {
        color: rgba(255, 255, 255, 0.95);
      }
    }
  }

  .divider {
    margin: $padding-24 0;
    width: 100%;
    max-width: 360px;
    transition: all var(--transition-duration) ease-in-out;

    :deep(.arco-divider-text) {
      font-size: $font-size-12;
      padding: 0 $padding-16;
      transition: all var(--transition-duration) ease-in-out;
    }
  }

  .social-login {
    display: flex;
    justify-content: center;
    gap: $length-20;
    margin-bottom: $padding-24;

    .social-button {
      width: 48px;
      height: 48px;
      border: 1px solid;
      transition: all var(--transition-duration) ease-in-out;
    }
  }

  .register-link {
    font-size: $font-size-14;
    transition: color var(--transition-duration) ease-in-out;

    a {
      font-weight: 600;
      margin-left: 4px;
      transition: color var(--transition-duration) ease-in-out;
    }

  }
}

.login-decoration {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-duration) ease-in-out;

  .decoration-video {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    object-fit: cover;
    z-index: 1;
  }

  .decoration-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $padding-24;
    background: rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(3px);
    transition: all var(--transition-duration) ease-in-out;
  }

  .decoration-content {
    text-align: center;
    max-width: 400px;
    z-index: 3;
    color: rgba(255, 255, 255, 0.95);
    transition: all var(--transition-duration) ease-in-out;
    animation: fadeInUp 1s ease-out;

    .animated-title-wrapper {
      position: relative;
      display: inline-block;
      margin-bottom: $padding-16;
    }

    .animated-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0;
      color: rgba(255, 255, 255, 0.95);
      transition: all var(--transition-duration) ease-in-out;
      animation: slideIn 1s ease-out 0.3s both;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      
      &.animated-title {
        display: inline-block;
        
        span {
          display: inline-block;
          animation: bounceText 2s ease-in-out infinite;
          
          &:nth-child(1) { animation-delay: 0s; }
          &:nth-child(2) { animation-delay: 0.1s; }
          &:nth-child(3) { animation-delay: 0.2s; }
          &:nth-child(4) { animation-delay: 0.3s; }
          &:nth-child(5) { animation-delay: 0.4s; }
          &:nth-child(6) { animation-delay: 0.5s; }
          &:nth-child(7) { animation-delay: 0.6s; }
          &:nth-child(8) { animation-delay: 0.7s; }
          &:nth-child(9) { animation-delay: 0.8s; }
        }
      }
    }

    .title-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120%;
      height: 120%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
      border-radius: 50%;
      animation: glow 3s ease-in-out infinite;
      pointer-events: none;
    }

    .animated-subtitle {
      margin-bottom: $padding-24;
      
      .subtitle-line {
        font-size: $font-size-16;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.9);
        transition: all var(--transition-duration) ease-in-out;
        animation: slideIn 1s ease-out 0.6s both;
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .floating-elements {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .floating-element {
      position: absolute;
      animation: float 6s ease-in-out infinite;
      opacity: 0.6;
      
      &.element-1 {
        top: 20%;
        left: 10%;
        animation-delay: 0s;
      }
      
      &.element-2 {
        top: 60%;
        right: 15%;
        animation-delay: 2s;
      }
      
      &.element-3 {
        bottom: 30%;
        left: 20%;
        animation-delay: 4s;
      }
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes bounceText {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes glow {
    0%, 100% {
      opacity: 0.3;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.6;
      transform: translate(-50%, -50%) scale(1.2);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }
}


@media (max-width: $tablet) {
  .login-page {
    flex-direction: column;
  }

  .login-container {
    max-width: none;
    min-height: 60vh;
  }

  .login-decoration {
    min-height: 40vh;

    .decoration-video {
      position: absolute;
      top: 50%;
      left: 50%;
      min-width: 100%;
      min-height: 100%;
      width: auto;
      height: auto;
      transform: translate(-50%, -50%);
      object-fit: cover;
    }

    .decoration-content h2 {
      font-size: 1.8rem;
    }
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
