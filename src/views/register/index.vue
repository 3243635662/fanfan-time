<template>
  <div class="register-page">
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
    
    <div class="register-container">
      <div class="register-header">
        <AppIcon name="line-md:emoji-smile" size="48" class="logo-icon" />
        <h1>创建账号</h1>
        <p class="subtitle">加入fan时光，开启精彩旅程</p>
      </div>

      <a-form ref="formRef" :model="formData" layout="vertical" @submit="handleRegister" class="register-form">
        <a-form-item field="username" :rules="usernameRules" :validate-trigger="['blur', 'change']">
          <a-input v-model="formData.username" placeholder="用户名" size="large" allow-clear>
            <template #prefix>
              <AppIcon name="mdi:user-outline" size="18" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item field="email" :rules="emailRules" :validate-trigger="['blur', 'change']">
          <a-input v-model="formData.email" placeholder="邮箱地址" size="large" allow-clear>
            <template #prefix>
              <AppIcon name="mdi:email-outline" size="18" />
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

        <a-form-item field="confirmPassword" :rules="confirmPasswordRules" :validate-trigger="['blur', 'change']">
          <a-input-password v-model="formData.confirmPassword" placeholder="确认密码" size="large" allow-clear>
            <template #prefix>
              <AppIcon name="mdi:lock-check-outline" size="18" />
            </template>
          </a-input-password>
        </a-form-item>


        <a-form-item field="emailCode" :rules="emailCodeRules" :validate-trigger="['blur', 'change']">
          <a-input-search
            v-model="formData.emailCode"
            :style="{width:'360px'}"
            placeholder="请输入邮箱验证码"
            :button-text="isSentEmailCode ? `${countdown}s后可重发` : '发送'"
            search-button
            @search="sendEmailCode"
          />
        </a-form-item>


        <a-form-item field="agreeTerms" :rules="agreeTermsRules" :validate-trigger="['change']">
          <a-checkbox v-model="formData.agreeTerms">
            我已阅读并同意
          </a-checkbox>
          <a-link>服务条款</a-link>
          和
          <a-link>隐私政策</a-link>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="isLoading"
            long
            class="register-button"
          >
            注册
          </a-button>
        </a-form-item>
      </a-form>

      <div class="login-link">
        <span>已有账号？</span>
        <router-link to="/login">立即登录</router-link>
      </div>
    </div>

    <div class="register-decoration">
      <video 
        class="decoration-video"
        src="http://video.fanblog.top/e9c86615-d390-4931-adec-d320887df542.mp4"
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
              <span>加</span><span>入</span><span>我</span><span>们</span><span>的</span><span>社</span><span>区</span>
            </h2>
            <div class="title-glow"></div>
          </div>
          <div class="animated-subtitle">
            <p class="subtitle-line">与志同道合的人交流，分享生活的点滴</p>
            <p class="subtitle-line">创造美好的回忆，开启精彩旅程</p>
          </div>
          <div class="features">
            <div class="feature-item">
              <AppIcon name="mdi:pencil-box-outline" size="24" />
              <span>记录生活</span>
            </div>
            <div class="feature-item">
              <AppIcon name="mdi:account-group-outline" size="24" />
              <span>结识朋友</span>
            </div>
            <div class="feature-item">
              <AppIcon name="mdi:cloud-outline" size="24" />
              <span>云端同步</span>
            </div>
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
            <div class="floating-element element-4">
              <AppIcon name="mdi:flower" size="16" color="#ff8787" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <CloudeflareTrust
      ref="turnstileRef"
      :sitekey="siteKey"
      @success="handleTurnstileSuccess"
      @error="handleTurnstileError"
      @expired="handleTurnstileExpired"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { useSettingStore } from "@/store/setting";
import { storeToRefs } from "pinia";
import AppIcon from "@/components/AppIcon.vue";
import CloudeflareTrust from "@/components/CloudeflareTrust.vue";
import { $notification } from "@/hooks/useNotification";
import type { FormInstance } from "@arco-design/web-vue";
import { sendEmailCodeAPI } from "@/api/auth";

const router = useRouter();
const authStore = useAuthStore();
const settingStore = useSettingStore();
const { isDark } = storeToRefs(settingStore);
const { isLoading } = storeToRefs(authStore);
const formRef = ref<FormInstance | null>(null);
const turnstileRef = ref<InstanceType<typeof CloudeflareTrust> | null>(null);
const turnstileToken = ref('');
const siteKey = import.meta.env.VITE_GLOB_SITE_KEY;
const toggleDarkMode = () => {
  settingStore.toggleDarkMode();
};
const isSentEmailCode = ref(false);
const countdown = ref(60);
const countdownTimer = ref<ReturnType<typeof setInterval> | null>(null);
const formData = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  emailCode: "",
  agreeTerms: false,
});

const usernameRules = [
  { required: true, message: "请输入用户名" },
  { minLength: 3, message: "用户名至少需要3个字符" },
  { maxLength: 20, message: "用户名不能超过20个字符" },
];

const emailRules = [
  { required: true, message: "请输入邮箱地址" },
  { type: "email", message: "请输入正确的邮箱格式" },
];

const passwordRules = [
  { required: true, message: "请输入密码" },
  { minLength: 6, message: "密码至少需要6个字符" },
  { maxLength: 20, message: "密码不能超过20个字符" },
];

const confirmPasswordRules = [
  { required: true, message: "请确认密码" },
  {
    validator: (value: string, callback: (error: string) => void) => {
      if (value !== formData.password) {
        callback("两次输入的密码不一致");
      }
    },
  },
];

const emailCodeRules = [
  { required: true, message: "请输入邮箱验证码" },
  { minLength: 6, maxLength: 6, message: "邮箱验证码必须是6个字符" },
];

const agreeTermsRules = [
  {
    validator: (value: boolean, callback: (error?: string) => void) => {
      if (!value) {
        callback("请先同意服务条款和隐私政策");
      }
    },
  },
];

// 开始验证码倒计时（防刷）
const startCountdown = () => {
  countdown.value = 60;
  isSentEmailCode.value = true;
  
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
  }
  
  countdownTimer.value = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      isSentEmailCode.value = false;
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value);
        countdownTimer.value = null;
      }
    }
  }, 1000);
};


// 发送邮箱验证码
const sendEmailCode = async () => {
  if (isSentEmailCode.value) {
    $notification.warning({
      title: "警告",
      content: `请等待${countdown.value}秒后再发送邮箱验证码`,
    });
    return;
  }
  if (!formData.email) {
    $notification.warning({
      title: "警告",
      content: "请先输入邮箱地址",
    });
    return;
  }
  if (!formData.agreeTerms) {
      $notification.warning({
        title: "警告",
        content: "请先同意服务条款和隐私政策",
      });
      return;
    }

  // 发送邮箱验证码

  try {
    const res=await sendEmailCodeAPI(formData.email);
    if (res.code === 0) {
      $notification.success({
        title: "成功",
        content: "邮箱验证码已发送",
      });
      startCountdown();
    }
      else {
        $notification.error({
          title: "错误",
          content: res.message || "发送邮箱验证码失败",
        });
      }
    }
   catch  {
    $notification.error({
      title: "错误",
      content: "发送邮箱验证码失败",
    });
  }
}

const handleRegister = async () => {
  // 先进行表单校验
  const errors = await formRef.value?.validate();
  if (errors) {
    // 表单校验失败，不提交注册
    return;
  }

  // 表单校验通过，显示 Turnstile 人机验证
  turnstileRef.value?.show();
};

/**
 * Turnstile 验证成功回调
 */
const handleTurnstileSuccess = async (token: string) => {
  turnstileToken.value = token;

  // 关闭人机验证弹窗
  turnstileRef.value?.hide();

  // 人机验证成功，执行注册
  const result = await authStore.register({
    username: formData.username,
    email: formData.email,
    password: formData.password,
    emailCode: formData.emailCode,
    
  });

  if (result.success) {
    $notification.success({
      title: "成功",
      content: result.message || "注册成功",
    });
    // 注册成功之后立即将账号密码传递到登录页
    router.push({
      name: "login",
      query: {
        username: formData.username,
        password: formData.password,
      },
    });
  } else {
    $notification.error({
      title: "错误",
      content: result.message || "注册失败",
    });
  }
};

/**
 * Turnstile 验证错误回调
 */
const handleTurnstileError = (code: string) => {
  console.error('Turnstile 验证错误:', code);
  $notification.error({
    title: '人机验证失败',
    content: '请重试',
  });
};

/**
 * Turnstile token 过期回调
 */
const handleTurnstileExpired = () => {
  turnstileToken.value = '';
  console.warn('Turnstile token 已过期');
};

// 组件卸载时清理定时器
onUnmounted(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
    countdownTimer.value = null;
  }
});
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.register-page {
  display: flex;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-duration) ease-in-out;
}

:deep(body.dark-mode) .register-page {
  // 在这里添加深色模式样式
}

// 顶部导航栏
.top-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
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

.register-container {
    .dark-mode & {
    background: rgba(0, 0, 0, 0.86);
  }
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: $padding-24;
  max-width: 500px;
  transition: all var(--transition-duration) ease-in-out;

  .register-header {
    text-align: center;
    margin-bottom: $padding-12;
    flex-shrink: 0;

    .logo-icon {
      margin-bottom: $padding-12;
      animation: bounce 2s ease-in-out infinite;
    }

    h1 {
      font-size: $font-size-24;
      font-weight: 700;
      margin: 0 0 $padding-4;
    }

    .subtitle {
      font-size: $font-size-12;
      margin: 0;
    }
  }

  .register-form {
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
        :deep(.arco-input-suffix) {
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
      height: 44px;
      font-size: $font-size-15;
      font-weight: 600;
      transition: all var(--transition-duration) ease-in-out;
    }
  }

  :deep(.arco-form-item) {
    margin-bottom: 16px;
    
    :deep(.arco-checkbox) {
      transition: color var(--transition-duration) ease-in-out;
      
      :deep(.arco-checkbox-label) {
        transition: color var(--transition-duration) ease-in-out;
      }
    }
    
    .dark-mode & {
      :deep(.arco-checkbox-label) {
        color: rgba(255, 255, 255, 0.95) !important;
      }
    }
  }

  .login-link {
    font-size: $font-size-14;
    transition: color var(--transition-duration) ease-in-out;
       padding-top:12px;

    a {
      font-weight: 600;
      margin-left: 4px;
      transition: color var(--transition-duration) ease-in-out;
    }
  }

  // 深色模式下的文字颜色
  .dark-mode & {
    :deep(.arco-checkbox-label) {
      color: rgba(255, 255, 255, 0.95) !important;
    }
  }
}

.register-decoration {
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

        &.element-4 {
          top: 40%;
          right: 25%;
          animation-delay: 1s;
        }
      }

      .features {
        display: flex;
        justify-content: center;
        gap: $padding-16;

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: $padding-4;
          padding: $padding-12;
          border-radius: $radius-8;
          transition: all var(--transition-duration) ease-in-out;
          border: 1px solid;
          min-width: 70px;

          :deep(.arco-icon) {
            font-size: 20px;
          }

          span {
            font-size: $font-size-12;
            font-weight: 500;
          }
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

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }


@media (max-width: $tablet) {
  .register-page {
    flex-direction: column;
    min-height: auto;
    height: auto;
    overflow-y: auto;
  }

  .top-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);

    .home-button,
    .theme-toggle {
      color: rgba(255, 255, 255, 0.95);
      background: rgba(255, 255, 255, 0.15);
      border-radius: $radius-8;
      padding: 4px 12px;

      &:hover {
        color: $gray-0;
        background: rgba(255, 255, 255, 0.25);
      }
    }
  }

  .register-container {
    max-width: none;
    min-height: auto;
    padding: 80px $padding-16 $padding-16;
    margin-top: 0;
    flex: none;
  }

  .register-decoration {
    min-height: 35vh;
    flex: none;
    position: relative;

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

    .decoration-content {
      h2 {
        font-size: 1.4rem;
        margin-bottom: $padding-8;
      }

      .animated-subtitle {
        .subtitle-line {
          font-size: $font-size-14;
          margin-bottom: $padding-8;
        }
      }

      .features {
        flex-wrap: wrap;
        gap: $padding-8;
        margin-top: $padding-12;

        .feature-item {
          padding: $padding-8;
          min-width: 70px;

          :deep(.arco-icon) {
            font-size: 18px;
          }

          span {
            font-size: $font-size-12;
          }
        }
      }

      .floating-elements {
        display: none;
      }
    }
  }
}

</style>
