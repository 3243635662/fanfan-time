import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { usePhotoStore } from "./photo";
import { useAuthStore } from "./auth";
import { $notification } from "@/hooks/useNotification";
import { router } from "@/router";
import { markedAndPushNewState, ModalAndDrawer_STATE_KEY } from "@/utils/history";

// 是否已经 push 了状态
let isPushedState = false
  
export const useSettingStore = defineStore("setting", () => {
  const photoStore = usePhotoStore()
  const authStore = useAuthStore()
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

  // 设置为新增模式并打开抽屉（使用History进行优化）
  const openAddMode = () => {
    isAddMode.value = true;
    isShowMessageDrawer.value = true;
    if (!isPushedState) {
      // 先替换当前状态为 Modal 状态 以及 新增一个空状态
      markedAndPushNewState()
      isPushedState = true
    }
  };

  // 设置为详情模式并打开抽屉
  const openDetailMode = () => {
    isAddMode.value = false;
    isShowMessageDrawer.value = true;
    if (!isPushedState) { 
      markedAndPushNewState()
      isPushedState = true
    }
  };

  // 关闭抽屉并重置模式
  const closeDrawer = () => {
    isShowMessageDrawer.value = false;
    isAddMode.value = false;
    if (isPushedState) {
      isPushedState = false
      history.back()
    }
  };




  // 处理浏览器返回键（popstate 事件）
  const handlePopState = (event: PopStateEvent) => {
    // 如果 Modal 是打开状态
    if (isShowModal.value) {
      // 用户执行了返回操作，关闭 Modal
      // 由于浏览器已经执行了 back，我们需要 forward 回来
      if (isPushedState) {
        // 先关闭 Modal
        photoStore.resetCommentsPage()
        isShowAddMediaModal.value = false
        isShowModal.value = false
        isShowMediaDetailModal.value = false
        isPushedState = false
        
        // 然后 forward 回到当前页面（抵消用户的 back）
        history.forward()
      }
    }
    if (isShowMessageDrawer.value) {
      if (isPushedState) {
    isShowMessageDrawer.value = false;
    isAddMode.value = false;
        isPushedState = false

        // 然后 forward 回到当前页面（抵消用户的 back）
        history.forward()
      }
    }
  }

  // 打开媒体详情弹窗
  const openMediaDetailModal = (id: number) => {
    photoStore.currentMediaId = id

    photoStore.getMediaDetail(id).then(() => {
      isShowAddMediaModal.value = false
      isShowModal.value = true
      isShowMediaDetailModal.value = true
      
      if (!isPushedState) {
        markedAndPushNewState()
        isPushedState = true
      }
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
    
    // 清理历史记录状态
    if (isPushedState) {
      isPushedState = false
      // 执行 back 来移除我们 push 的空状态
      history.back()
    }
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
      
      // 添加历史记录状态，用于拦截返回手势
      if (!isPushedState) {
        markedAndPushNewState()
        isPushedState = true
      }
    }
  }
  // 关闭添加媒体弹窗
  const closeAddMediaModal = () => {
    isShowAddMediaModal.value = false
    isShowModal.value = false
    
    // 清理历史记录状态
    if (isPushedState) {
      isPushedState = false
      // 执行 back 来移除我们 push 的空状态
      history.back()
    }
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
    closeAddMediaModal,
    handlePopState
  };
});
