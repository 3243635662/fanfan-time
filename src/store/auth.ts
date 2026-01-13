import { $notification } from '@/hooks/useNotification';
import { defineStore } from "pinia";
import { ref } from "vue";
import type { UserInfo, LoginParams, RegisterParams } from "@/types";
import { getUserInfoAPI, loginAPI } from "@/api/auth";
import { STORAGE_KEYS, APP_PREFIX, TOKEN_EXPIRY_24H } from "@/utils/constants";
import { router } from "@/router";

export const useAuthStore = defineStore("auth", () => {
  const userInfo = ref<UserInfo | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const isLogin = ref(false);


  const switchLoginStatus = () => {
    isLogin.value = !isLogin.value;
  };

  const switchIsLoadingStatus = () => {
    isLoading.value = !isLoading.value;
  };

  const getUserInfo = async () => {
    try {
      const res = await getUserInfoAPI()
      userInfo.value = res.result
    } catch (error) {
      $notification.error({
        title: "获取用户信息失败",
        content: error instanceof Error ? error.message : "未知错误",
      });
    }
  }


  const login = async (params: LoginParams) => {
    isLoading.value = true;
    try {
      const res = await loginAPI({
        username: params.username,
        password: params.password,
      })

      if (res.code === 0) {
        token.value = res.result.token;
        isLogin.value = true;

        // 根据"记住我"选项决定是否持久化token
        if (params.remember) {
          // 记住我：存24小时
          localStorage.setItem(`${APP_PREFIX}:${STORAGE_KEYS.TOKEN}`, res.result.token);
          const expiryDate = new Date(Date.now() + TOKEN_EXPIRY_24H).toISOString();
          localStorage.setItem(`${APP_PREFIX}:${STORAGE_KEYS.TOKEN_EXPIRY}`, expiryDate);
        }
        // 登录成功后获取用户信息
        await getUserInfo()
        // 
        return { success: true, message: res.message || "登录成功" };
      } else {
        return { success: false, message: res.message || "登录失败" };
      }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : "登录错误" };
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (params: RegisterParams) => {
    switchIsLoadingStatus();

    try {
      // TODO: 实现真实的注册逻辑
      // 这里暂时返回模拟的成功响应
      return { success: true, message: "注册成功" };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    isLogin.value = false;
    userInfo.value = null;
    token.value = null;
    // 清除localStorage中的token（只有记住我时才会存）
    localStorage.removeItem(`${APP_PREFIX}:${STORAGE_KEYS.TOKEN}`);
    localStorage.removeItem(`${APP_PREFIX}:${STORAGE_KEYS.USER}`);
    localStorage.removeItem(`${APP_PREFIX}:${STORAGE_KEYS.TOKEN_EXPIRY}`);
    router.push('/home');
  };


  // 初始化函数：检查是否有记住的token
  const initAuth = () => {
    const storedToken = localStorage.getItem(`${APP_PREFIX}:${STORAGE_KEYS.TOKEN}`);
    const expiry = localStorage.getItem(`${APP_PREFIX}:${STORAGE_KEYS.TOKEN_EXPIRY}`);
    if (storedToken && expiry) {
      const expiryDate = new Date(expiry);
      const now = new Date();

      if (expiryDate > now) {
        // token未过期，恢复登录状态
        token.value = storedToken;
        isLogin.value = true;
      } else {
        // token已过期，清除存储
        logout();
      }
    }
  };

  return {
    userInfo,
    token,
    isLoading,
    isLogin,
    login,
    register,
    logout,
    initAuth,
    switchLoginStatus,
    switchIsLoadingStatus
  };
});
