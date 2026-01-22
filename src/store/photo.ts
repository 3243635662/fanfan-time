import { defineStore } from "pinia";
import { ref } from "vue";
import { getMediaDetailAPI } from "@/api/photo";
import type { MediaDetail } from "@/types";
import { $message } from "@/hooks/useMessage";
export const usePhotoStore = defineStore("photo", () => {
  // 当前详情媒体Id
  const currentMediaId = ref(0)
  const commentsPage = ref(1)
  const currentMediaDetail = ref<MediaDetail>()
  const getMediaDetail = async (id: number) => {
    try {
      const res = await getMediaDetailAPI(id, commentsPage.value)
      if (res.result && res.code === 0) {
        currentMediaDetail.value = res.result
      } else {
        $message.error('获取媒体详情失败')
        currentMediaDetail.value = {} as MediaDetail
      }
    } catch {
      $message.error('获取媒体详情失败')
      currentMediaDetail.value = {} as MediaDetail
    }
  }

  const addCommentsPage = () => {
    commentsPage.value++
  }

  const setCommentsPage = (page: number) => {
    commentsPage.value = page
  }

  const resetCommentsPage = () => {
    commentsPage.value = 1
  }



  return {
    commentsPage,
    currentMediaId,
    currentMediaDetail,
    getMediaDetail,
    addCommentsPage,
    setCommentsPage,
    resetCommentsPage,
  }
})
