import { defineStore } from "pinia";
import { ref } from "vue";

export const usePhotoStore = defineStore("photo", () => {
  const currentMediaId = ref(0)
  const showDetailModal = ref(false)

  const openDetailModal = (mediaId: number) => {
    currentMediaId.value = mediaId
    showDetailModal.value = true
  }

  const closeDetailModal = () => {
    showDetailModal.value = false
  }

  return {
    currentMediaId,
    showDetailModal,
    openDetailModal,
    closeDetailModal
  }
})
