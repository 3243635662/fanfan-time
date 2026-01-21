<template>
  <div class="modal-overlay" v-if="isShowModal" @click.self="settingStore.closeMediaDetailModal">
    <!-- 详情内容区域 -->
    <div class="modal-content" v-if="isShowMediaDetailModal && currentMediaDetail">
      <div class="modal-left">
        <a-carousel v-if="currentMediaDetail.type === 1 && currentMediaDetail.imageUrls?.length" :auto-play="false" indicator-type="dot" show-arrow="hover">
          <a-carousel-item v-for="(url, index) in currentMediaDetail.imageUrls" :key="index">
            <img :src="url" :alt="`post-${index}`" style="width: 100%; height: 100%; object-fit: cover;" />
          </a-carousel-item>
        </a-carousel>
        <video v-else :src="currentMediaDetail.videoUrl" controls class="post-video" />
      </div>

      <div class="modal-right">
        <div class="modal-header">
          <div class="user-info">
            <FanAvatar :imageUrl="currentMediaDetail.publisher.avatar" class="avatar" />
            <div class="user-details">
              <h3>{{ currentMediaDetail.publisher.nickname || currentMediaDetail.publisher.username }}</h3>
            </div>
          </div>
          <button class="close-btn" @click="settingStore.closeMediaDetailModal">
            <AppIcon name="mdi:close" :size="24" color="#666" />
          </button>
        </div>

        <div class="post-title">
          <h2 ref="titleElement" :class="{ expanded: isTitleExpanded }">{{ currentMediaDetail.title }}</h2>
          <button v-if="isTitleOverflow" class="expand-btn" @click="toggleTitle">
            {{ isTitleExpanded ? '收起' : '展开' }}
          </button>
        </div>

        <div class="post-text">
          <p>{{ currentMediaDetail.content }}</p>
          <div class="hashtags">
            <span v-for="tag in currentMediaDetail.tags" :key="tag" class="tag" @click="handleTagClick(tag)">#{{ tag }}</span>
          </div>
        </div>

        <div class="post-actions">
          <div class="action-btn" @click="toggleLike">
            <AppIcon name="mdi:heart" :size="20" :color="isLiked ? '#ff2442' : '#666'" />
            <span>{{ currentMediaDetail.likedCount }}</span>
          </div>
          <div class="action-btn">
            <AppIcon name="mdi:eye-outline" :size="20" color="#666" />
            <span>{{ currentMediaDetail.viewCount }}</span>
          </div>
          <div class="action-btn">
            <AppIcon name="mdi:share-variant-outline" :size="20" color="#666" />
            <span>{{ currentMediaDetail.sharedCount }}</span>
          </div>
        </div>

        <div class="comments-section">
          <h4>评论 ({{ currentMediaDetail.commentCount }})</h4>
          <div class="comments-container" ref="commentsContainerRef">
            <div class="comments-list" ref="commentsListRef">
              <div v-for="comment in currentMediaDetail.comments.list" :key="comment.id" class="comment">
                <img :src="comment.avatar" alt="comment-avatar" class="comment-avatar" />
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.nickname || comment.username }}</span>
                    <span class="comment-time">{{ formatTime(comment.publishTime) }}</span>
                  </div>
                  <p>{{ comment.content }}</p>
                </div>
              </div>
            </div>
            <PullToLoadIndicator v-if="isLoadingMore || hasMore" :is-loading="isLoadingMore" type="bottom">
              <template #icon>
                <AppIcon name="mdi:chevron-down" :size="20" color="#165dff" />
              </template>
              <template #loading>
                <AppIcon name="line-md:loading-alt-loop" :size="20" color="#165dff" />
              </template>
            </PullToLoadIndicator>
            <div v-if="!hasMore && currentMediaDetail.comments.list.length > 0" class="no-more-comments">
              —— 没有更多评论了 ——
            </div>
          </div>
        </div>

        <div class="comment-input-wrapper">
          <div class="comment-input-container">
            <FanAvatar :imageUrl="userInfo?.avatar" :size="32" class="comment-avatar" />
            <a-input
              v-model="newComment"
              placeholder="写下你的评论..."
              :max-length="200"
              show-word-limit
              class="comment-input"
              @pressEnter="submitComment"
            />
            <a-button type="outline" size="small"  status="danger" @click="submitComment" :disabled="!newComment.trim()">
              <AppIcon name="mdi:send" :size="16" />
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 上传内容区域 -->
    <div class="modal-upload" v-else>
      <div class="upload-container">
        <div class="upload-header">
          <div class="user-info">
            <div class="user-details">
              <FanAvatar :imageUrl="userInfo?.avatar" class="avatar" />
            </div>
          </div>
          <button class="close-btn" @click="settingStore.closeMediaDetailModal">
            <AppIcon name="mdi:close" :size="24" color="#666" />
          </button>
        </div>

        <a-tabs type="rounded" :default-active-key="currentTabs" lazy-load :animation="true" class="custom-tabs" @change="handleTabsChange">
          <a-tab-pane :key="TabsPane[0]?.key" :title="TabsPane[0]?.title">
            <div class="image-upload-content">
              <div class="upload-wrapper">
              <a-upload
                list-type="picture-card"
                :file-list="fileList"
                :show-upload-button="true"
                :show-preview-button="true"
                :custom-request="handleImageUpload"
                @change="handleFileChange"
                @exceed-limit="handleExceedLimit"
                accept="image/*"
                :limit="5"
              >
                <div v-if="fileList.length === 0" class="upload-placeholder">
                  <AppIcon name="mdi:plus" :size="40" color="#999" />
                  <span>上传图片</span>
                </div>
              </a-upload>
            </div>
              <div class="form-section">
                <a-input
                  v-model="uploadForm.title"
                  placeholder="添加标题..."
                  :max-length="50"
                  show-word-limit
                  class="title-input"
                />
              </div>

              <div class="form-section">
                <a-textarea
                  v-model="uploadForm.content"
                  placeholder="添加描述..."
                  :max-length="500"
                  show-word-limit
                  :rows="4"
                  class="content-input"
                />
              </div>

              <div class="form-section">
                <div class="category-label">选择分类</div>
                <div class="category-options">
                  <div
                    v-for="cat in categories"
                    :key="cat.value"
                    :class="['category-item', { active: uploadForm.category === cat.value }]"
                    @click="handleCategoryChange(cat.value)"
                  >
                    {{ cat.label }}
                  </div>
                </div>
              </div>

              <div class="form-section hashtags-section">
                <div class="hashtags-label">添加标签</div>
                <div class="hashtags-list">
                  <span
                    v-for="tag in availableTags"
                    :key="tag"
                    :class="['hashtag-item', { active: selectedTags.includes(tag) }]"
                    @click="toggleTag(tag)"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </a-tab-pane>

          <a-tab-pane :key="TabsPane[1]?.key" :title="TabsPane[1]?.title">
            <div class="video-upload-content">
              <div class="upload-wrapper">
                <a-upload draggable :limit="1" accept="video/*"
                :custom-request="handleUploadVideo">
                  
                </a-upload>
              </div>
              <div class="form-section">
                <a-input
                  v-model="uploadForm.title"
                  placeholder="添加标题..."
                  :max-length="50"
                  show-word-limit
                  class="title-input"
                />
              </div>

              <div class="form-section">
                <a-textarea
                  v-model="uploadForm.content"
                  placeholder="添加描述..."
                  :max-length="500"
                  show-word-limit
                  :rows="4"
                  class="content-input"
                />
              </div>

              <div class="form-section">
                <div class="category-label">选择分类</div>
                <div class="category-options">
                  <div
                    v-for="cat in categories"
                    :key="cat.value"
                    :class="['category-item', { active: uploadForm.category === cat.value }]"
                    @click="handleCategoryChange(cat.value)"
                  >
                    {{ cat.label }}
                  </div>
                </div>
              </div>

              <div class="form-section hashtags-section">
                <div class="hashtags-label">添加标签</div>
                <div class="hashtags-list">
                  <span
                    v-for="tag in availableTags"
                    :key="tag"
                    :class="['hashtag-item', { active: selectedTags.includes(tag) }]"
                    @click="toggleTag(tag)"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>

        <div class="upload-footer">
          <a-button type="primary" :disabled="canSubmit" :loading="uploading" class="publish-btn" @click="handlePublish">
            发布
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useSettingStore } from '@/store/setting'
import { usePhotoStore } from '@/store/photo'
import { storeToRefs } from 'pinia'
import { computed, ref, watch, nextTick, onUnmounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import type { FileItem,RequestOption } from '@arco-design/web-vue'
import AppIcon from '@/components/AppIcon.vue'
import { useAuthStore } from '@/store/auth'
import FanAvatar from '@/views/home/components/Fan-Avatar.vue'
import PullToLoadIndicator from '@/views/home/components/PullToLoadIndicator.vue'
import { usePullToLoad } from '@/composables/usePullToLoad'
import { getMediaDetailAPI } from '@/api/photo'
const { userInfo } = storeToRefs(useAuthStore())
const settingStore = useSettingStore()
const photoStore = usePhotoStore()
const { isShowMediaDetailModal, isShowModal } = storeToRefs(settingStore)
const { currentMediaDetail } = storeToRefs(photoStore)
const currentTabs = ref('image')
const imageHostingURL = 'https://api.xinyew.cn/api/360tc'

// Arco Upload 文件列表（用于 UI 回显）
const fileList = ref<FileItem[]>([])
// 图床返回的 URL 列表（用于后续入库）
const imgUrlList = ref<string[]>([])

const uploading = ref(false)

const TabsPane = [
  { key: 'image', title: '图片' },
  { key: 'video', title: '视频' },
]

const uploadForm = ref({
  title: '',
  content: '',
  category: null as number | null,
})

const categories = [
  { value: 1, label: '好看' },
  { value: 2, label: '风景' },
]

const availableTags = ['风景', '摄影', '自然', '旅行', '生活', '日常', '美好', '艺术']
const selectedTags = ref<string[]>([])

const canSubmit = computed(() => {
  return (imgUrlList.value.length > 0 && uploadForm.value.title.trim() !== '' && uploadForm.value.category !== null)
})

const isLiked = ref(false)
const isTitleExpanded = ref(false)
const isTitleOverflow = ref(false)
const titleElement = ref<HTMLElement | null>(null)
const commentsContainerRef = ref<HTMLElement | null>(null)
const newComment = ref('')
const isLoadingMore = ref(false)
const hasMore = ref(true)

const cleanUrl = (url: string): string => {
  if (!url) return ''
  try {
    const urlObj = new URL(url)
    return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`
  } catch {
    return url
  }
}

// 自定义图片上传
const handleImageUpload = async (options: RequestOption) => {
  const { fileItem, onSuccess, onError, onProgress } = options || {}
  const rawFile: File | undefined = fileItem?.file

  if (!rawFile) {
    onError?.(new Error('未获取到文件'))
    return
  }

  if (!rawFile.type.startsWith('image/')) {
    Message.error('请选择图片文件')
    onError?.(new Error('请选择图片文件'))
    return
  }

  if (rawFile.size > 5 * 1024 * 1024) {
    Message.error('图片大小不能超过 5MB')
    onError?.(new Error('图片大小不能超过 5MB'))
    return
  }

  try {
    if (fileItem) fileItem.status = 'uploading'
    onProgress?.(20)

    const formData = new FormData()
    formData.append('file', rawFile)

    const uploadResponse = await fetch(imageHostingURL, { method: 'POST', body: formData })
    if (!uploadResponse.ok) throw new Error(`图床上传失败: HTTP ${uploadResponse.status}`)

    const uploadResult = await uploadResponse.json()
    if (!uploadResult || uploadResult.errno !== 0 || !uploadResult.data?.url) {
      throw new Error(uploadResult?.error || '图床返回数据格式错误')
    }

    const cleaned = cleanUrl(uploadResult.data.url)
    // 这里增加一个时间戳
    const finalUrl = cleaned.includes('?') ? `${cleaned}&t=${Date.now()}` : `${cleaned}?t=${Date.now()}`

    imgUrlList.value.push(finalUrl)
    console.log('[360图床] upload url:', finalUrl)

    if (fileItem) {
      fileItem.url = finalUrl
      fileItem.status = 'done';
      fileItem.response = uploadResult
    }

    onProgress?.(100)
    onSuccess?.(uploadResult)
  } catch (e) {
    const err = e instanceof Error ? e : new Error('上传失败')
    if (fileItem) fileItem.status = 'error'
    Message.error(`图片上传失败: ${err.message}`)
    onError?.(err)
  }
}

// 自定义视频上传
const handleUploadVideo = async (options: RequestOption) => {
  const { fileItem, onSuccess, onError, onProgress } = options || {}
  const rawFile: File | undefined = fileItem?.file
  if (!rawFile) {
    onError?.(new Error('未获取到文件'))
    return
  }

  if (!rawFile.type.startsWith('video/')) {
    Message.error('请选择视频文件')
    onError?.(new Error('请选择视频文件'))
    return
  }

  if (rawFile.size > 50 * 1024 * 1024) {
    Message.error('视频大小不能超过 50MB')
    onError?.(new Error('视频大小不能超过 50MB'))
    return
  }


}

// 每次这个文件上传change事件,将imgUrls进行一个更新
const handleFileChange = (nextList: FileItem[]) => {
  // 旧的文件列表的Url数组
  const prevUrls = new Set((fileList.value.map((i: FileItem) => i.url).filter(Boolean) as string[]) || [])
  // 新的文件列表的Url数组
  const nextUrls = new Set((nextList.map((i:FileItem) => i.url).filter(Boolean) as string[]) || [])

  // 过滤
  for (const url of prevUrls) {
    if (!nextUrls.has(url)) {
      imgUrlList.value = imgUrlList.value.filter((u) => u !== url)
    }
  }

  fileList.value = nextList
}

const handleExceedLimit = () => {
  Message.warning('最多只能上传5张图片')
}

const handleCategoryChange = (category: number) => {
  uploadForm.value.category = category
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else if (selectedTags.value.length < 5) {
    selectedTags.value.push(tag)
  } else {
    Message.warning('最多选择5个标签')
  }
}
const handleTagClick = (tag: string) => {
  // 做一个关闭弹窗，然后搜索框直接搜索tags
console.log(tag);

}

// 上拉加载更多
async function handleLoadMore() {
  if (isLoadingMore.value || !hasMore.value || !currentMediaDetail.value?.id) return

  isLoadingMore.value = true
  const startTime = Date.now()
  const minLoadingTime = 800 // 最小加载时间 800ms，让加载动画清晰可见

  try {
    const nextPage = currentMediaDetail.value.comments.page + 1
    const res = await getMediaDetailAPI(currentMediaDetail.value.id, nextPage)

    if (res.result && res.code === 0 && currentMediaDetail.value) {
      currentMediaDetail.value.comments.list.push(...res.result.comments.list)
      currentMediaDetail.value.comments.page = res.result.comments.page
      currentMediaDetail.value.comments.total = res.result.comments.total
      currentMediaDetail.value.comments.totalPage = res.result.comments.totalPage
      photoStore.setCommentsPage(nextPage)
      hasMore.value = res.result.comments.page < res.result.comments.totalPage

      // 延时确保加载动画清晰可见
      const elapsedTime = Date.now() - startTime
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime))
      }
    } else {
      Message.error('加载更多失败')
    }
  } catch {
    Message.error('加载更多失败')
  } finally {
    isLoadingMore.value = false
  }
}

// 提交评论（函数留着，用户自己写）
const submitComment = () => {
  // TODO: 实现提交评论逻辑
  console.log('提交评论:', newComment.value)
}

const handlePublish = async () => {

  if (!canSubmit.value) return

  uploading.value = true
  try {
    console.log('Publish:', {
      imgUrlList: imgUrlList.value,
      title: uploadForm.value.title,
      content: uploadForm.value.content,
      category: uploadForm.value.category,
      tags: selectedTags.value,
    })

    Message.success('发布成功！')

    uploadForm.value = { title: '', content: '', category: null }
    fileList.value = []
    imgUrlList.value = []
    selectedTags.value = []

    settingStore.closeMediaDetailModal()
  } catch (error) {
    Message.error('发布失败，请重试')
  } finally {
    uploading.value = false
  }
}


// 切换标签时，重置内容页
const handleTabsChange = () => {
  uploadForm.value = { title: '', content: '', category: null }
}

const formatTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return new Date(date).toLocaleDateString()
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
}

const toggleTitle = () => {
  isTitleExpanded.value = !isTitleExpanded.value
}

const checkTitleOverflow = () => {
  if (titleElement.value) {
    const element = titleElement.value
    const computedStyle = window.getComputedStyle(element)
    const lineHeight = Number.parseFloat(computedStyle.lineHeight)
    const maxHeight = lineHeight * 1
    isTitleOverflow.value = element.scrollHeight > maxHeight
  }
}

// 下拉刷新功能
const {
  bindEvents,
  unbindEvents
} = usePullToLoad({
  threshold: 60,
  onLoadMore: handleLoadMore,
  hasMore: hasMore,
  isLoading: isLoadingMore.value
})

watch(isShowModal, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
}, { immediate: true })

watch(isShowMediaDetailModal, async (newValue) => {
  if (newValue) {
    setTimeout(checkTitleOverflow, 100)
    photoStore.resetCommentsPage()
    await nextTick()
    if (commentsContainerRef.value) {
      bindEvents(commentsContainerRef.value)
    }
  } else {
    isTitleExpanded.value = false
    unbindEvents()
  }
}, { immediate: true })

watch(() => currentMediaDetail.value?.comments, (newVal) => {
  if (newVal) {
    hasMore.value = newVal.page < newVal.totalPage
  }
}, { immediate: true, deep: true })

onUnmounted(() => {
  unbindEvents()
})

watch(() => photoStore.currentMediaDetail?.title, () => {
  setTimeout(checkTitleOverflow, 0)
}, { immediate: true })
</script>


<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding-top: 50px;
}

.modal-content {
  background: $gray-0;
  border-radius: $radius-12;
  width: 90%;
  max-width: 1000px;
  max-height: 85vh;
  display: flex;
  overflow: hidden;
  position: relative;
}

.modal-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 400px;
  background: #000;

  :deep(.arco-carousel) {
    width: 100%;
    height: 100%;
  }




  :deep(.arco-carousel-arrow-left),
  :deep(.arco-carousel-arrow-right) {
    width: 20px;
    height: 20px;
    background: rgba(0, 0, 0, 0.7);
    border: 3px solid rgba(255, 255, 255, 0.6);
    color: #fff;
    font-size: 28px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    opacity: 0;

    &:hover {
      background: rgba(0, 0, 0, 0.9);
      border-color: #fff;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.7);
    }
  }

  :deep(.arco-carousel:hover .arco-carousel-arrow-left),
  :deep(.arco-carousel:hover .arco-carousel-arrow-right) {
    opacity: 1;
  }

  :deep(.arco-carousel-arrow-left) {
    left: 20px;
  }

  :deep(.arco-carousel-arrow-right) {
    right: 20px;
  }
}
.modal-right {
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $padding-16;
  border-bottom: 1px solid $gray-2;
  flex-shrink: 0;

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  .avatar {
      display: block;
      border-radius: 50%;
      border: 2px solid transparent;
      background: linear-gradient($gray-0, $gray-0) padding-box,
        linear-gradient(135deg, #ff8e8e 0%, #ff6b6b 100%) border-box;
  }
  .close-btn {
    background: none;
    border: none;
    font-size: $font-size-24;
    cursor: pointer;
    color: $gray-5;
    transition: color 0.3s ease;

    &:hover {
      color: $gray-7;
    }
  }
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.post-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.post-title {
  padding: $padding-16;
  border-bottom: 1px solid $gray-2;
  h2 {
    margin: 0;
    font-size: $font-size-20;
    font-weight: 700;
    color: var(--color-text-primary, $gray-7);
    line-height: 1.4;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    transition: all 0.3s ease;

    &.expanded {
      -webkit-line-clamp: unset;
    }
  }

  .expand-btn {
    margin-top: 8px;
    padding: 3px 10px;
    background: transparent;
    color: var(--color-text-secondary, $gray-5);
    border: 1px solid var(--color-border, $gray-2);
    border-radius: $radius-12;
    font-size: $font-size-12;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 400;
    letter-spacing: 0.5px;

    &:hover {
      background: var(--color-bg-1, $gray-1);
      color: var(--color-text-primary, $gray-7);
      border-color: var(--color-text-tertiary, $gray-5);
    }
  }
}

.post-text {
  padding: $padding-16;
  line-height: 1.6;
  border-bottom: 1px solid $gray-2;

  .hashtags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  .tag {
    color: #ff2442;
    cursor: pointer;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.7;
    }
  }
}

.post-actions {
  display: flex;
  justify-content: space-around;
  padding: $padding-16;
  border-bottom: 1px solid $gray-2;
  flex-shrink: 0;

  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }

    span {
      font-size: $font-size-12;
      color: $gray-5;
    }
  }
}

.comments-section {
  padding: $padding-16;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  h4 {
    margin: 0 0 15px 0;
    font-size: $font-size-16;
    flex-shrink: 0;
  }

  .comments-container {
    flex: 1;
    overflow-y: auto;
    position: relative;
  }

  .comments-list {
    margin-top: 15px;
  }

  .comment {
    display: flex;
    gap: 12px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid $gray-2;

    &:last-child {
      border-bottom: none;
    }

    .comment-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .comment-content {
      flex: 1;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }

    .comment-author {
      font-weight: bold;
      font-size: $font-size-14;
    }

    .comment-time {
      font-size: $font-size-12;
      color: $gray-4;
    }

    p {
      margin: 0;
      font-size: $font-size-14;
      line-height: 1.5;
    }
  }
}

.comment-input-wrapper {
  padding: $padding-16;
  border-top: 1px solid $gray-2;
  background: $gray-0;
  flex-shrink: 0;

  .comment-input-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .comment-avatar {
    flex-shrink: 0;
  }

  .comment-input {
    flex: 1;
  }

  :deep(.arco-input-wrapper) {
    background: $gray-1;
    border: 1px solid $gray-2;
    border-radius: 20px;
    transition: all 0.3s ease;

    &:hover {
      border-color: $gray-4;
    }

    &:focus-within {
      border-color: #ff2442;
      background: $gray-0;
    }
  }

  :deep(.arco-input) {
    background: transparent;
    border: none;
    padding: 8px 16px;
  }
}

.no-more-comments {
  text-align: center;
  padding: 20px 0;
  color: $gray-4;
  font-size: $font-size-14;
  user-select: none;
}

.dark-mode {
  .modal-content {
    background: $gray-8;
  }

  .modal-left {
    background: $gray-9;
  }

  .post-carousel {
    :deep(.arco-carousel-indicator) {
      background: rgba(255, 255, 255, 0.3);

      &.arco-carousel-indicator-active {
        background: #ff2442;
      }
    }

    :deep(.arco-carousel-arrow) {
      background: rgba(255, 255, 255, 0.15);

      &:hover {
        background: rgba(255, 255, 255, 0.25);
      }
    }
  }

  .carousel-item {
    background: transparent;
  }

  .modal-header {
    border-bottom-color: $gray-6;

    .user-details h3 {
      color: var(--color-text-primary, $gray-0);
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .close-btn {
      color: $gray-4;

      &:hover {
        color: $gray-0;
      }
    }
  }

  .post-title {
    border-bottom-color: $gray-6;

    h2 {
      color: var(--color-text-primary, $gray-1);
    }

    .expand-btn {
      color: var(--color-text-secondary, $gray-4);
      border-color: $gray-6;

      &:hover {
        background: var(--color-bg-1, $gray-7);
        color: var(--color-text-primary, $gray-0);
        border-color: $gray-4;
      }
    }
  }

  .post-text {
    color: $gray-1;
    border-bottom-color: $gray-6;

    .tag {
      color: #ff2442;
    }
  }

  .post-actions {
    border-bottom-color: $gray-6;

    .action-btn span {
      color: $gray-4;
    }
  }

  .comments-section {
    h4 {
      color: $gray-0;
    }

    .comment {
      border-bottom-color: $gray-6;

      .comment-author {
        color: $gray-0;
      }

      .comment-time {
        color: $gray-4;
      }

      p {
        color: $gray-1;
      }
    }
  }

  .no-more-comments {
    color: $gray-5;
  }

  .comment-input-wrapper {
    border-top-color: $gray-6;
    background: $gray-8;

    :deep(.arco-input-wrapper) {
      background: $gray-7;
      border-color: $gray-6;

      &:hover {
        border-color: $gray-5;
      }

      &:focus-within {
        border-color: #ff2442;
        background: $gray-8;
      }
    }
  }
}

@media (max-width: $mobile) {
  .modal-overlay {
    padding-top: 0;
    align-items: flex-start;
  }

  .dark-mode {
    .modal-content {
      background: $gray-9;
    }

    .modal-left {
      background: $gray-10;
    }

    .modal-right {
      background: $gray-9;
    }

    .modal-header {
      border-bottom-color: $gray-7;
      background: $gray-8;

      .user-details h3 {
        color: $gray-0;
      }

      .close-btn {
        color: $gray-3;

        &:hover {
          color: $gray-0;
        }
      }
    }

    .post-title {
      border-bottom-color: $gray-7;
      background: $gray-8;

      h2 {
        color: $gray-0;
      }

      .expand-btn {
        color: $gray-3;
        border-color: $gray-7;

        &:hover {
          background: $gray-7;
          color: $gray-0;
          border-color: $gray-5;
        }
      }
    }

    .post-text {
      color: $gray-1;
      border-bottom-color: $gray-7;
      background: $gray-8;

      .tag {
        color: #ff2442;
      }
    }

    .post-actions {
      border-bottom-color: $gray-7;
      background: $gray-8;

      .action-btn span {
        color: $gray-3;
      }
    }

    .comments-section {
      background: $gray-8;

      h4 {
        color: $gray-0;
      }

      .comment {
        border-bottom-color: $gray-7;

        .comment-author {
          color: $gray-0;
        }

        .comment-time {
          color: $gray-4;
        }

        p {
          color: $gray-1;
        }
      }
    }

    .no-more-comments {
      color: $gray-4;
    }

    .comment-input-wrapper {
      border-top-color: $gray-7;
      background: $gray-8;

      :deep(.arco-input-wrapper) {
        background: $gray-7;
        border-color: $gray-6;

        &:hover {
          border-color: $gray-5;
        }

        &:focus-within {
          border-color: #ff2442;
          background: $gray-8;
        }
      }
    }

    :deep(.arco-carousel-indicator) {
      background: rgba(255, 255, 255, 0.4);

      &.arco-carousel-indicator-active {
        background: #ff2442;
      }
    }

    :deep(.arco-carousel-arrow-left),
    :deep(.arco-carousel-arrow-right) {
      background: rgba(0, 0, 0, 0.8);
      border-color: rgba(255, 255, 255, 0.7);

      &:hover {
        background: rgba(0, 0, 0, 0.95);
        border-color: #fff;
      }
    }
  }

  .modal-content {
    flex-direction: column;
    max-height: 100vh;
    height: 100vh;
    width: 100%;
    max-width: 100%;
    border-radius: 0;
    overflow: hidden;
  }

  .modal-left {
    flex: 0 0 auto;
    height: 40vh;
    min-height: 300px;
    position: relative;
  }

  .modal-right {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 24px 24px 0 0;
    margin-top: -24px;
    position: relative;
    z-index: 10;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    max-height: 100vh;
  }

  .modal-header {
    padding: $padding-12;
    border-bottom: 1px solid $gray-2;
    flex-shrink: 0;

    .user-info {
      gap: 10px;
    }

    .user-details h3 {
      font-size: $font-size-14;
    }

    .avatar {
      width: 36px;
      height: 36px;
    }

    .close-btn {
      padding: 4px;
    }
  }

  .post-title {
    padding: $padding-12;
    flex-shrink: 0;

    h2 {
      font-size: $font-size-16;
      line-height: 1.5;
    }

    .expand-btn {
      margin-top: 6px;
      padding: 2px 8px;
      font-size: $font-size-12;
    }
  }

  .post-text {
    padding: $padding-12;
    font-size: $font-size-14;
    line-height: 1.6;
    flex-shrink: 0;

    .hashtags {
      margin-top: 10px;
    }

    .tag {
      font-size: $font-size-12;
      padding: 4px 10px;
    }
  }

  .post-actions {
    padding: $padding-10;
    gap: 0;
    flex-shrink: 0;

    .action-btn {
      gap: 4px;

      span {
        font-size: $font-size-12;
      }
    }
  }

  .comments-section {
    padding: $padding-12;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;

    h4 {
      font-size: $font-size-14;
      margin-bottom: 12px;
    }

    .comment {
      gap: 10px;
      margin-bottom: 12px;
      padding-bottom: 12px;

      .comment-avatar {
        width: 32px;
        height: 32px;
      }

      .comment-author {
        font-size: $font-size-13;
      }

      .comment-time {
        font-size: $font-size-11;
      }

      p {
        font-size: $font-size-13;
        line-height: 1.5;
      }
    }
  }

  .comment-input-wrapper {
    padding: $padding-10;
    border-top: 1px solid $gray-2;
    flex-shrink: 0;

    .comment-input-container {
      gap: 8px;
    }

    .comment-avatar {
      width: 28px;
      height: 28px;
    }

    :deep(.arco-input-wrapper) {
      border-radius: 16px;
    }

    :deep(.arco-input) {
      padding: 6px 12px;
      font-size: $font-size-14;
    }

    :deep(.arco-btn) {
      padding: 0 12px;
      height: 32px;
    }
  }

  :deep(.arco-carousel-arrow-left),
  :deep(.arco-carousel-arrow-right) {
    width: 44px;
    height: 44px;
    font-size: 20px;
  }

  :deep(.arco-carousel-arrow-left) {
    left: 12px;
  }

  :deep(.arco-carousel-arrow-right) {
    right: 12px;
  }

  :deep(.arco-carousel-indicator) {
    width: 8px;
    height: 8px;
  }

  :deep(.arco-carousel-indicator-active) {
    width: 24px;
    height: 8px;
  }
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 95%;
  }

  .modal-right {
    flex: 0 0 350px;
  }

  .post-actions {
    .action-btn {
      gap: 6px;
    }
  }
}

.modal-upload {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;

  .upload-container {
    background: $gray-0;
    border-radius: $radius-12;
    overflow: hidden;
  }

  .upload-header {
    display: grid;
    grid-template-columns: 1fr auto 1fr; /* 左占位 | 中内容 | 右占位 */
    align-items: center;
    padding: $padding-16;
    border-bottom: 1px solid $gray-2;

    .user-info {
      grid-column: 2;              /* 放中间列 */
      justify-self: center;        /* 中间列内再居中 */
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      display: block;
      border-radius: 50%;
      border: 2px solid transparent;
      background: linear-gradient($gray-0, $gray-0) padding-box,
        linear-gradient(135deg, #ff8e8e 0%, #ff6b6b 100%) border-box;
    }

    .user-details h3 {
      margin: 0;
      font-size: $font-size-16;
      font-weight: 600;
      background: linear-gradient(135deg, #ff8e8e 0%, #ff6b6b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .close-btn {
      grid-column: 3;              /* 放右边列 */
      justify-self: end;           /* 靠右 */
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      transition: background-color 0.3s ease;

      &:hover {
        background: $gray-1;
      }
    }
  }
  .image-upload-content {
    padding: $padding-16;

    .arco-upload-list {
      margin-bottom: $padding-16;
    }

    .arco-upload-picture-card {
      width: 100%;
      height: 200px;
      border-radius: $radius-12;
      border: 2px dashed $gray-3;
      background: $gray-1;
      transition: all 0.3s ease;

      &:hover {
        border-color: #ff2442;
        background: rgba(#ff2442, 0.05);
      }
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: $gray-4;

      span {
        font-size: $font-size-14;
      }
    }
    .arco-upload-list-picture-card .arco-upload-list-item {
      border-radius: $radius-12;
      border: none;
    }
  }
.video-upload-content {
  padding: $padding-16;
}
  .form-section {
    margin-bottom: $padding-16;

    :deep(.arco-input-wrapper){
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      background-color: #f8f8f8;
      transition: all 0.3s ease;
      &:hover {
        border-color: #ff2442;
        background-color: #fff;
      }
      .arco-input {
        font-size: $font-size-14;
        padding: $padding-12;
        color: #333;
        &::placeholder {
          color: #999;
        }
      }
    }

    :deep(.arco-textarea-wrapper){
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      background-color: #f8f8f8;
      transition: all 0.3s ease;
      &:hover {
        border-color: #ff2442;
        background-color: #fff;
      }
      .arco-textarea {
        font-size: $font-size-14;
        padding: $padding-12;
        color: #333;
        &::placeholder {
          color: #999;
        }
      }
    }
  }
.upload-wrapper{
  margin: 10px;
}


  .category-label {
    font-size: $font-size-14;
    font-weight: 600;
    color: $gray-7;
    margin-bottom: $padding-12;
  }

  .category-options {
    display: flex;
    gap: $padding-12;
  }

  .category-item {
    padding: 8px 20px;
    border-radius: 20px;
    font-size: $font-size-14;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid $gray-2;
    color: $gray-6;
    background: $gray-0;

    &:hover {
      border-color: #ff2442;
      color: #ff2442;
    }
    &.active {
      background: linear-gradient(135deg, #ff8e8e 0%, #ff6b6b 100%);
      border-color: transparent;
      color: $gray-0;
    }
  }

  .hashtags-section {
    .hashtags-label {
      font-size: $font-size-14;
      font-weight: 600;
      color: $gray-7;
      margin-bottom: $padding-12;
    }

    .hashtags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .hashtag-item {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: $font-size-12;
      cursor: pointer;
      transition: all 0.3s ease;
      background: $gray-1;
      color: $gray-6;

      &:hover {
        background: rgba(#ff2442, 0.1);
        color: #ff2442;
      }

      &.active {
        background: rgba(#ff2442, 0.15);
        color: #ff2442;
      }
    }
  }

  .upload-footer {
    padding: $padding-16;
    border-top: 1px solid $gray-2;
  }

  .publish-btn {
    width: 100%;
    height: 44px;
    font-size: $font-size-16;
    font-weight: 600;
    background: linear-gradient(135deg, #ff8e8e 0%, #ff6b6b 100%);
    border: none;
    border-radius: $radius-24;
    transition: all 0.3s ease;
    &:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(#ff6b6b, 0.4);
    }

    &:disabled {
      background: $gray-3;
      color: $gray-5;
    }
  }
}
.custom-tabs {
      :deep(.arco-tabs-nav) {
        display: flex;
        justify-content: center;
        width: 100%;

        .arco-tabs-nav-tab-list {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          width: fit-content;
      .arco-tabs-tab-active {
      background: linear-gradient(135deg, #ff8e8e 0%, #ff6b6b 100%);
      border-color: transparent;
      color: $gray-0;
          }
        }

        .arco-tabs-nav-wrap {
          display: flex;
          justify-content: center;
          width: 100%;
        }
      }

      :deep(.arco-tabs-content) {
        .arco-tabs-content-item {
          padding: 0;
        }
      }
    }
.dark-mode {
  .modal-upload .upload-container {
    background: $gray-8;
  }
  .modal-upload .upload-header {
    border-bottom-color: $gray-6;

    .user-details h3 {
      color: $gray-0;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .close-btn:hover {
      background: $gray-6;
    }
  }

  .modal-upload .image-upload-content {
    .title-input {
      background: $gray-7;
      color: $gray-0;

      &::placeholder {
        color: $gray-5;
      }
    }

    .content-input {
      background: $gray-7;
      color: $gray-0;

      &::placeholder {
        color: $gray-5;
      }
    }
    .arco-upload-picture-card {
      background: $gray-7;
      border-color: $gray-6;

      &:hover {
        border-color: #ff2442;
        background: rgba(#ff2442, 0.1);
      }
    }

    .upload-placeholder {
      color: $gray-5;
    }
  }

  .modal-upload .category-label,
  .modal-upload .hashtags-section .hashtags-label {
    color: $gray-1;
  }

  .modal-upload .category-item {
    background: $gray-7;
    border-color: $gray-6;
    color: $gray-4;

    &:hover {
      border-color: #ff2442;
      color: #ff2442;
    }
  }

  .modal-upload .hashtag-item {
    background: $gray-7;
    color: $gray-4;

    &:hover,
    &.active {
      background: rgba(#ff2442, 0.2);
      color: #ff2442;
    }
  }

  .modal-upload .upload-footer {
    border-top-color: $gray-6;
  }
}

@media (max-width: $mobile) {
  .modal-upload {
    width: 95%;
  }

  .modal-upload .image-upload-content .arco-upload-picture-card {
    height: 180px;
  }
  .modal-upload .category-options {
    flex-wrap: wrap;
  }

  .modal-upload .category-item {
    flex: 1;
    text-align: center;
    min-width: 80px;
  }
}
</style>
