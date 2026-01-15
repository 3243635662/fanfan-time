import { $notification } from '@/hooks/useNotification';
import { defineStore } from "pinia";
import { ref } from "vue";
import type { UserInfo, LoginParams, RegisterData } from "@/types";
import { getUserInfoAPI, loginAPI, registerAPI } from "@/api/auth";
import { STORAGE_KEYS, APP_PREFIX, TOKEN_EXPIRY_24H } from "@/utils/constants";
import { router } from "@/router";

export const useAuthStore = defineStore("auth", () => {
  const userInfo = ref<UserInfo | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const isLogin = ref(false);

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
        // 这里需要携带token去获取，又分记住我和不记住我
        return { success: true, message: res.message || "登录成功" };
      } else {
        return { success: false, message: res.message || "登录失败" };
      }
    } catch (error: any) {
      // 处理HTTP错误响应
      if (error.response?.data) {
        const errorData = error.response.data;
        return {
          success: false,
          message: errorData.message || "登录失败"
        };
      }
      return {
        success: false,
        message: error instanceof Error ? error.message : "登录错误"
      };
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (data: RegisterData) => {
    isLoading.value = true;

    try {
      const res = await registerAPI(data)
      if (res.code === 0) {
        return { success: true, message: res.message || "注册成功" };
      } else {
        return { success: false, message: res.message || "注册失败" };
      }
    }
    catch (error: any) {
      // 处理HTTP错误响应
      if (error.response?.data) {
        const errorData = error.response.data;
        return {
          success: false,
          message: errorData.message || "注册失败"
        };
      }
      return {
        success: false,
        message: error instanceof Error ? error.message : "注册错误"
      };
    }
    finally {
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
        // 登录成功后获取用户信息
        getUserInfo()
      } else {
        // token已过期，清除存储
        $notification.error({
          title: "登录过期",
          content: "您的登录会话已过期，请重新登录。",
        });
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
  };
});
