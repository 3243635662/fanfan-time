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
        <AppIcon name="streamline-freehand-color:messages-bubble-smile" size="48" class="logo-icon" />
        <h1>创建账号</h1>
        <p class="subtitle">加入fan时光，开启精彩旅程</p>
      </div>

      <a-form :model="formData" layout="vertical" @submit.prevent="handleRegister" class="register-form">
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

        <a-form-item>
          <a-checkbox v-model="formData.agreeTerms">
            我已阅读并同意
            <a-link>服务条款</a-link>
            和
            <a-link>隐私政策</a-link>
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="authStore.loading"
            long
            class="register-button"
            :disabled="!formData.agreeTerms"
          >
            注册
          </a-button>
        </a-form-item>
      </a-form>

      <a-divider orientation="center" class="divider">
        <span class="divider-text">其他注册方式</span>
      </a-divider>

      <div class="social-register">
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

      <div class="login-link">
        <span>已有账号？</span>
        <router-link to="/login">立即登录</router-link>
      </div>
    </div>

    <div class="register-decoration">
      <video 
        class="decoration-video"
        src="@/assets/video/register.mp4"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
      ></video>
      <div class="decoration-overlay">
        <div class="decoration-content">
          <h2>加入我们的社区</h2>
          <p>与志同道合的人交流，分享生活的点滴，创造美好的回忆</p>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { useSettingStore } from "@/store/setting";
import { storeToRefs } from "pinia";
import { $message } from "@/hooks/useMessage";
import AppIcon from "@/components/AppIcon.vue";

const router = useRouter();
const authStore = useAuthStore();
const settingStore = useSettingStore();
const { isDark } = storeToRefs(settingStore);

const toggleDarkMode = () => {
  settingStore.toggleDarkMode();
};

const formData = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
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

const handleRegister = async () => {
  if (!formData.agreeTerms) {
    $message.warning("请先同意服务条款和隐私政策");
    return;
  }

  const result = await authStore.register({
    username: formData.username,
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  });

  if (result.success) {
    $message.success(result.message || "注册成功");
    router.push("/login");
  } else {
    $message.error(result.message || "注册失败");
  }
};
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
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 $padding-24;
  backdrop-filter: blur(8px);
  z-index: 100;
  transition: all var(--transition-duration) ease-in-out;

  .home-button,
  .theme-toggle {
    font-weight: 500;
    transition: all var(--transition-duration) ease-in-out;
  }

  .home-button {
    margin-right: auto;
  }

  .theme-toggle {
    margin-left: 16px;
  }
}

// 深色模式下的顶部导航栏
:deep(body.dark-mode) .top-nav {
  // 在这里添加深色模式样式
}

.register-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: $padding-24;
  max-width: 500px;
  overflow-y: auto;
  margin-top: 60px;
  transition: all var(--transition-duration) ease-in-out;

  .register-header {
    text-align: center;
    margin-bottom: $padding-12;
    flex-shrink: 0;

    .logo-icon {
      margin-bottom: $padding-12;
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
  
  // 深色模式下的注册容器
  :deep(body.dark-mode) & {
    // 在这里添加深色模式样式
  }

  .register-form {
    width: 100%;
    max-width: 360px;

    :deep(.arco-form-item) {
      margin-bottom: $length-16;
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
    
    // 深色模式下的表单样式
    :deep(body.dark-mode) & {
      // 在这里添加深色模式样式
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
    
    // 深色模式下的表单选项
    :deep(body.dark-mode) & {
      // 在这里添加深色模式样式
    }
  }

  .divider {
    margin: $padding-20 0;
    width: 100%;
    max-width: 360px;
    transition: all var(--transition-duration) ease-in-out;

    :deep(.arco-divider-text) {
      font-size: $font-size-12;
      padding: 0 $padding-16;
      transition: all var(--transition-duration) ease-in-out;
    }
    
    // 深色模式下的分割线
    :deep(body.dark-mode) & {
      // 在这里添加深色模式样式
    }
  }

  .social-register {
    display: flex;
    justify-content: center;
    gap: $length-16;
    margin-bottom: $padding-20;

    .social-button {
      width: 44px;
      height: 44px;
      border: 1px solid;
      transition: all var(--transition-duration) ease-in-out;
    }
    
    // 深色模式下的社交注册按钮
    :deep(body.dark-mode) & {
      // 在这里添加深色模式样式
    }
  }

  .login-link {
    font-size: $font-size-14;
    transition: color var(--transition-duration) ease-in-out;

    a {
      font-weight: 600;
      margin-left: 4px;
      transition: color var(--transition-duration) ease-in-out;
    }
    
    // 深色模式下的登录链接
    :deep(body.dark-mode) & {
      // 在这里添加深色模式样式
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
    transition: all var(--transition-duration) ease-in-out;
  }

  .decoration-content {
    text-align: center;
    max-width: 400px;
    z-index: 3;
    transition: all var(--transition-duration) ease-in-out;

    h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: $padding-16;
      transition: all var(--transition-duration) ease-in-out;
    }

    p {
      font-size: $font-size-16;
      line-height: 1.8;
      margin-bottom: $padding-24;
      transition: all var(--transition-duration) ease-in-out;
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
  
  // 深色模式下的装饰区域
  :deep(body.dark-mode) & {
    // 在这里添加深色模式样式
  }
}

@media (max-width: $tablet) {
  .register-page {
    flex-direction: column;
  }

  .register-container {
    max-width: none;
    min-height: 60vh;
    margin-top: 0; // 移动端不需要顶部间距
  }

  .register-decoration {
    min-height: 35vh;

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
        font-size: 1.6rem;
        margin-bottom: $padding-12;
      }

      p {
        font-size: $font-size-14;
        margin-bottom: $padding-20;
      }

      .features {
        flex-wrap: wrap;
        gap: $padding-8;

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
    }
  }
}
</style>
