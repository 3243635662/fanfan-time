<template>
  <div class="register-page">
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
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { $message } from "@/hooks/useMessage";
import AppIcon from "@/components/AppIcon.vue";

const router = useRouter();
const authStore = useAuthStore();

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
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.register-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: $padding-24;
  background: $gray-0;
  max-width: 500px;

  .register-header {
    text-align: center;
    margin-bottom: $padding-24;

    .logo-icon {
      margin-bottom: $padding-16;
      color: $success;
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

  .register-form {
    width: 100%;
    max-width: 360px;

    :deep(.arco-form-item) {
      margin-bottom: $length-20;
    }

    :deep(.arco-input) {
      border-radius: $radius-8;
    }

    :deep(.arco-btn-primary) {
      background: linear-gradient(135deg, $success 0%, darken($success, 10%) 100%);
      border: none;
      border-radius: $radius-8;
      height: 48px;
      font-size: $font-size-16;
      font-weight: 600;

      &:hover {
        background: linear-gradient(135deg, darken($success, 5%) 0%, darken($success, 15%) 100%);
      }

      &:disabled {
        background: $gray-3;
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

  .social-register {
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
        border-color: $success;
        background: rgba($success, 0.05);
      }
    }
  }

  .login-link {
    font-size: $font-size-14;
    color: $gray-5;

    a {
      color: $success;
      font-weight: 600;
      margin-left: 4px;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.register-decoration {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
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
      margin-bottom: $padding-24;
    }

    .features {
      display: flex;
      justify-content: center;
      gap: $padding-24;

      .feature-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $padding-8;
        padding: $padding-16;
        background: rgba($gray-0, 0.1);
        border-radius: $radius-12;
        transition: all 0.3s ease;

        &:hover {
          background: rgba($gray-0, 0.2);
          transform: translateY(-4px);
        }

        span {
          font-size: $font-size-14;
          font-weight: 500;
        }
      }
    }
  }
}

@media (max-width: $tablet) {
  .register-page {
    flex-direction: column;
  }

  .register-container {
    max-width: none;
    min-height: 65vh;
  }

  .register-decoration {
    min-height: 35vh;

    .decoration-content {
      h2 {
        font-size: 1.8rem;
      }

      .features {
        flex-wrap: wrap;
        gap: $padding-12;

        .feature-item {
          padding: $padding-12;
          min-width: 80px;
        }
      }
    }
  }
}
</style>
