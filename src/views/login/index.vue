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
        <AppIcon name="streamline-freehand-color:messages-bubble-smile" size="48" class="logo-icon" />
        <h1>欢迎回来</h1>
        <p class="subtitle">登录fan时光，记录美好时刻</p>
      </div>

      <a-form :model="formData" layout="vertical" @submit.prevent="handleLogin" class="login-form">
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
            :loading="authStore.loading"
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
        src="@/assets/video/login.mp4" 
        autoplay 
        muted 
        loop 
        playsinline
        preload="auto"
      ></video>
      <div class="decoration-overlay">
        <div class="decoration-content">
          <h2>记录每一个精彩瞬间</h2>
          <p>分享你的想法，记录你的生活，与朋友一起创造美好的回忆</p>
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
    return;
  }

  const result = await authStore.login({
    username: formData.username,
    password: formData.password,
  });

  if (result.success) {
    router.push("/");
  }
};
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
.dark-mode .top-nav {
  // 在这里添加深色模式样式
}

.login-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: $padding-24;
  max-width: 500px;
  margin-top: 60px;
  transition: all var(--transition-duration) ease-in-out;

  .login-header {
    text-align: center;
    margin-bottom: $padding-24;

    .logo-icon {
      margin-bottom: $padding-16;
      transition: color var(--transition-duration) ease-in-out;
    }

    h1 {
      font-size: $font-size-28;
      font-weight: 700;
      margin: 0 0 $padding-8;
      transition: color var(--transition-duration) ease-in-out;
    }

    .subtitle {
      font-size: $font-size-14;
      margin: 0;
      transition: color var(--transition-duration) ease-in-out;
    }
  }

  // 深色模式下的登录容器
  :deep(body.dark-mode) & {
    // 在这里添加深色模式样式
  }

  .login-form {
    width: 100%;
    max-width: 360px;

    :deep(.arco-form-item) {
      margin-bottom: $length-20;
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
    
    // 深色模式下的表单选项
    :deep(body.dark-mode) & {
      // 在这里添加深色模式样式
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
    
    // 深色模式下的分割线
    :deep(body.dark-mode) & {
      // 在这里添加深色模式样式
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
    
    // 深色模式下的社交登录按钮
    :deep(body.dark-mode) & {
      // 在这里添加深色模式样式
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
    
    // 深色模式下的注册链接
    :deep(body.dark-mode) & {
      // 在这里添加深色模式样式
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
      transition: all var(--transition-duration) ease-in-out;
    }
  }
  
  // 深色模式下的装饰区域
  :deep(body.dark-mode) & {
    // 在这里添加深色模式样式
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
</style>
