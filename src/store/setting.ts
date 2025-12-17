import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingStore = defineStore("setting", () => {
  const isDark = ref(false);
  const isShowTextCursor=ref(false)
  const isShowMessageDrawer = ref(false)
  const isAddMode = ref(false) // 新增模式状态
  const DockTitle = ref("欢迎来到fan时光");

  const toggleDarkMode = () => {
    isDark.value = !isDark.value;
  };

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
