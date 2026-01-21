import { defineStore } from "pinia";
import { ref } from "vue";

export const usePhotoStore = defineStore("photo", () => {
  const currentMediaId = ref(0)

  return {
    currentMediaId,
  }
})
