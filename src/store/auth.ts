import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UserInfo, LoginParams, RegisterParams } from "@/types";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<UserInfo | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const login = async (params: LoginParams) => {
    loading.value = true;
    error.value = null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (params.username === "admin" && params.password === "123456") {
        const mockUser: UserInfo = {
          id: 1,
          username: params.username,
          email: "admin@example.com",
          avatar: "",
          createdAt: new Date().toISOString(),
        };

        const mockToken = "mock-jwt-token-" + Date.now();

        user.value = mockUser;
        token.value = mockToken;

        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(mockUser));

        return { success: true };
      } else {
        throw new Error("用户名或密码错误");
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "登录失败";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const register = async (params: RegisterParams) => {
    loading.value = true;
    error.value = null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (params.password !== params.confirmPassword) {
        throw new Error("两次输入的密码不一致");
      }

      if (params.username.length < 3) {
        throw new Error("用户名至少需要3个字符");
      }

      if (params.password.length < 6) {
        throw new Error("密码至少需要6个字符");
      }

      const mockUser: UserInfo = {
        id: Math.floor(Math.random() * 1000) + 1,
        username: params.username,
        email: params.email,
        createdAt: new Date().toISOString(),
      };

      return { success: true, message: "注册成功", user: mockUser };
    } catch (err) {
      error.value = err instanceof Error ? err.message : "注册失败";
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const initializeAuth = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
      } catch {
        logout();
      }
    }
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    initializeAuth,
  };
});
