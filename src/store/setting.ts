import { defineStore } from "pinia";
import { ref, watch } from "vue";

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

  watch(isDark, (newValue) => {
    if (newValue) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
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

  return {
    isDark,
    isShowMessageDrawer,
    isAddMode,
    DockTitle,
    isShowTextCursor,
    toggleDarkMode,
    setDockTitle,
    toggleMessageDrawer,
    openAddMode,
    openDetailMode,
    closeDrawer
  };
});
