import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { usePhotoStore } from "./photo";
import { useAuthStore } from "./auth";
import { $notification } from "@/hooks/useNotification";
import { router } from "@/router";
const photoStore = usePhotoStore()
const authStore = useAuthStore()
export const useSettingStore = defineStore("setting", () => {
  // 是否夜间
  const isDark = ref(false);
  // 是否显示鼠标光标
  const isShowTextCursor = ref(false)
  // 是否显示抽屉
  const isShowMessageDrawer = ref(false)
  // 新增模式状态
  const isAddMode = ref(false)
  const DockTitle = ref("");
  const toggleDarkMode = () => {
    isDark.value = !isDark.value;
  };
  // 是否是媒体详情弹窗
  const isShowMediaDetailModal = ref(false)
  // 是否是添加媒体弹窗
  const isShowAddMediaModal = ref(false)
  const isShowModal = ref(false)
  watch(isDark, (newValue) => {
    if (newValue) {
      document.body.classList.add("dark-mode");
      document.body.setAttribute('arco-theme', 'dark')
    } else {
      document.body.classList.remove("dark-mode");
      document.body.setAttribute('arco-theme', 'light')
    }
  }, { immediate: true });

  const setDockTitle = (title: string) => {
    DockTitle.value = title;
  };

  const toggleMessageDrawer = () => {
    isShowMessageDrawer.value = !isShowMessageDrawer.value;
  };

  // 设置为新增模式并打开抽屉
  const openAddMode = () => {
    isAddMode.value = true;
    isShowMessageDrawer.value = true;
  };

  // 设置为详情模式并打开抽屉
  const openDetailMode = () => {
    isAddMode.value = false;
    isShowMessageDrawer.value = true;
  };

  // 关闭抽屉并重置模式
  const closeDrawer = () => {
    isShowMessageDrawer.value = false;
    isAddMode.value = false;
  };
  // 打开媒体详情弹窗
  const openMediaDetailModal = (id: number) => {
    photoStore.currentMediaId = id

    photoStore.getMediaDetail(id).then(() => {
      isShowAddMediaModal.value = false
      isShowModal.value = true
      isShowMediaDetailModal.value = true
    }).catch(() => {
      isShowAddMediaModal.value = false
      isShowModal.value = false
      isShowMediaDetailModal.value = false
    })
  }

  // 关闭媒体详情弹窗
  const closeMediaDetailModal = () => {
    photoStore.resetCommentsPage()
    isShowAddMediaModal.value = false
    isShowModal.value = false
    isShowMediaDetailModal.value = false
  }
  // 打开添加媒体弹窗 (检查是否登录)
  const openAddMediaModal = () => {
    if (!authStore.isLogin) {
      $notification.error({
        title: "登录后才能添加媒体",
        content: "请先登录账号",
      });
      router.push({ name: "login" })
    }
    else {
      isShowMediaDetailModal.value = false
      isShowAddMediaModal.value = true
      isShowModal.value = true
    }
  }
  // 关闭添加媒体弹窗
  const closeAddMediaModal = () => {

    isShowAddMediaModal.value = false
    isShowModal.value = false
  }
  return {
    isShowModal,
    isDark,
    isShowMessageDrawer,
    isAddMode,
    DockTitle,
    isShowTextCursor,
    isShowMediaDetailModal,
    isShowAddMediaModal,
    toggleDarkMode,
    setDockTitle,
    toggleMessageDrawer,
    openAddMode,
    openDetailMode,
    closeDrawer,
    openMediaDetailModal,
    closeMediaDetailModal,
    openAddMediaModal,
    closeAddMediaModal
  };
});
