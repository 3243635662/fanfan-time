<template>
  <div class="login-page">
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
      <div class="decoration-content">
        <h2>记录每一个精彩瞬间</h2>
        <p>分享你的想法，记录你的生活，与朋友一起创造美好的回忆</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import AppIcon from "@/components/AppIcon.vue";

const router = useRouter();
const authStore = useAuthStore();

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: $padding-24;
  background: $gray-0;
  max-width: 500px;

  .login-header {
    text-align: center;
    margin-bottom: $padding-24;

    .logo-icon {
      margin-bottom: $padding-16;
      color: $primary;
    }

    h1 {
      font-size: $font-size-28;
      font-weight: 700;
      color: $gray-8;
      margin: 0 0 $padding-8;
    }

    .subtitle {
      font-size: $font-size-14;
      color: $gray-5;
      margin: 0;
    }
  }

  .login-form {
    width: 100%;
    max-width: 360px;

    :deep(.arco-form-item) {
      margin-bottom: $length-20;
    }

    :deep(.arco-input) {
      border-radius: $radius-8;
    }

    :deep(.arco-btn-primary) {
      background: linear-gradient(135deg, $primary 0%, darken($primary, 10%) 100%);
      border: none;
      border-radius: $radius-8;
      height: 48px;
      font-size: $font-size-16;
      font-weight: 600;

      &:hover {
        background: linear-gradient(135deg, darken($primary, 5%) 0%, darken($primary, 15%) 100%);
      }
    }
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .divider {
    margin: $padding-24 0;
    width: 100%;
    max-width: 360px;

    .divider-text {
      font-size: $font-size-12;
      color: $gray-4;
      padding: 0 $padding-16;
      background: $gray-0;
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
      border: 1px solid $gray-2;
      background: $gray-0;

      &:hover {
        border-color: $primary;
        background: rgba($primary, 0.05);
      }
    }
  }

  .register-link {
    font-size: $font-size-14;
    color: $gray-5;

    a {
      color: $primary;
      font-weight: 600;
      margin-left: 4px;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.login-decoration {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: $padding-24;

  .decoration-content {
    text-align: center;
    color: $gray-0;
    max-width: 400px;

    h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: $padding-16;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    p {
      font-size: $font-size-16;
      opacity: 0.9;
      line-height: 1.8;
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

    .decoration-content h2 {
      font-size: 1.8rem;
    }
  }
}
</style>
