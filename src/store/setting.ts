import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingStore = defineStore("setting", () => {
  const isDark = ref(false);
  
  return {
    isDark
  };
});
