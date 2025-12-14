import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingStore = defineStore("setting", () => {
  const isDark = ref(false);
  const isShowTextCursor=ref(false)
  const isShowMessageDrawer = ref(false)
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

  return {
    isDark,
    isShowMessageDrawer,
    DockTitle,
    isShowTextCursor,
    toggleDarkMode,
    setDockTitle,
    toggleMessageDrawer
  };
});
