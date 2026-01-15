<template>
  <a-drawer :width="560" :visible="visible" @ok="handleOk" @cancel="handleCancel" unmountOnClose :footer="false">
    <template #title>
      <div class="drawer-title">
        <span>{{ isAddMode ? '新增留言' : '详情' }}</span>
      </div>
    </template>

    <!-- 新增模式 -->
    <div v-if="isAddMode" class="add-container">
      <a-form :model="addMessageForm" layout="vertical" class="add-form">
        <a-form-item label="内容" required>
          <div class="content-input-wrapper" :style="{ backgroundColor: addMessageForm.backgroundColor }">
            <a-textarea v-model="addMessageForm.content" placeholder="分享你的想法..." :rows="12" :max-length="500" show-word-limit
              class="content-textarea" />
          </div>
        </a-form-item>

        <a-form-item label="标签">
          <a-select v-model:value="addMessageForm.tag" placeholder="选择标签">
            <a-option v-for="option in categoryOptions" :key="option.type" :value="option.type">
              {{ option.title }}
            </a-option>
          </a-select>
        </a-form-item>

        <a-form-item label="背景色">
          <div class="color-picker">
            <div v-for="color in backgroundColorOptions" :key="color" class="color-option"
              :class="{ active: addMessageForm.backgroundColor === color }" :style="{ backgroundColor: color }"
              @click="addMessageForm.backgroundColor = color"></div>
          </div>
        </a-form-item>

        <a-form-item>
          <div class="form-actions">
            <a-button @click="handleCancel">取消</a-button>
            <a-button type="primary" @click="submitNewMessage" :disabled="!addMessageForm.content.trim()">
              发布
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>

    <!-- 详情模式 -->
    <div class="detail-container" v-else-if="messageDetail">
      <!-- 头部信息 -->
      <div class="detail-header">
        <div class="header-content">
          <div class="user-info">
            <FanAvatar :size="40" :imageUrl="messageDetail.publisher?.avatar" :username="messageDetail.publisher?.nickname || messageDetail.publisher?.username" />
            <div class="user-details">
              <div class="username">{{ messageDetail.publisher?.nickname || messageDetail.publisher?.username }}</div>
              <div class="time">{{ formatTime(messageDetail.time) }}</div>
            </div>
          </div>
          <a-tag color="blue" size="small">{{ messageDetail.tag }}</a-tag>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="detail-content" :style="{ backgroundColor: messageDetail.backgroundColor || '#f5f5f5' }">
        <p class="content-text">{{ messageDetail.content }}</p>
      </div>

      <!-- 统计信息 -->
      <div class="detail-stats">
        <div class="stat-item like-item" :class="{ liked: isLiked }" @click="handleLike">
          <AppIcon name="mdi:heart" :size="26" :color="isLiked ? '#ff6b6b' : '#666'" />
          <span>{{ messageDetail.likedCount || 0 }}</span>
        </div>
        <div class="stat-item">
          <AppIcon name="mdi:message-text" :size="26" color="#666" />
          <span>{{ messageDetail.commentCount || 0 }}</span>
        </div>
        <div class="stat-item">
          <a-popconfirm content="举报后将提交给管理员审核" ok-text="确定" cancel-text="取消" @ok="handleReport">
            <div class="report-item">
              <a-badge :count="9" :offset="[2, -2]">
                <AppIcon name="icon-park:report" :size="26" />
              </a-badge>
            </div>
          </a-popconfirm>
        </div>
      </div>

      <!-- 评论区域 -->
      <div class="comments-section-wrapper" ref="commentsContainerRef">
        <div class="comments-section">
          <a-divider orientation="left">
            <span class="comments-title">评论 {{ totalComments }}</span>
          </a-divider>

          <!-- 评论列表 -->
          <div class="comments-list" ref="commentsListRef">
            <a-comment 
              v-for="comment in comments" 
              :key="comment.id"
              :author="comment.nickname || comment.username"
              :datetime="formatTime(comment.time)" 
              :content="comment.content"
            >
              <template #avatar>
                <FanAvatar :imageUrl="comment.avatar" :username="comment.nickname || comment.username" />
              </template>
            </a-comment>
          </div>

          <!-- 加载指示器（刷新和加载更多都在这里显示） -->
          <PullToLoadIndicator
            v-if="isRefreshing || isLoadingMore || hasMore"
            :is-loading="isRefreshing || isLoadingMore"
            type="bottom"
          >
          <template #icon>
    <AppIcon name="mdi:chevron-down" :size="28" color="#165dff" />
  </template>
  <template #loading>
    <AppIcon name="line-md:loading-alt-loop" :size="28" color="#165dff" />
  </template>
        </PullToLoadIndicator>
          <div v-else-if="comments.length > 0" class="no-more">
            —— 没有更多评论了 ——
          </div>
        </div>
      </div>

      <!-- 添加评论 -->
      <div class="add-comment">
        <a-divider orientation="left">
          <span class="add-comment-title">添加评论</span>
        </a-divider>
        <a-comment>
          <template #avatar>
            <FanAvatar :size="32" :imageUrl="userInfo?.avatar" :username="userInfo?.nickname || userInfo?.username" />
          </template>
          <template #content>
            <a-textarea v-model="newComment" placeholder="请输入评论..." :rows="3" :max-length="200" show-word-limit
              class="comment-input" />
            <div class="comment-actions">
              <a-button type="primary" size="small" @click="addComment" :disabled="!newComment.trim()">
                评论
              </a-button>
            </div>
          </template>
        </a-comment>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!isAddMode" class="empty-state">
      <a-empty description="暂无数据" />
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { usePullToLoad } from '@/composables/usePullToLoad'
import PullToLoadIndicator from './PullToLoadIndicator.vue'
import { $message } from '@/hooks/useMessage'
import AppIcon from '@/components/AppIcon.vue'
import FanAvatar from './Fan-Avatar.vue'
import type { CategoryOption, MessageDetailData } from '@/types'
import { createMessageAPI, getMessageDetailByIdAPI } from '@/api/home'
import { formatTime } from '@/utils'
import { useAuthStore } from '@/store/auth'
import { storeToRefs } from 'pinia'

// Props
interface Props {
  visible: boolean
  isAddMode: boolean
  messageDetail: MessageDetailData | null
  categoryOptions: CategoryOption[]
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  isAddMode: false,
  messageDetail: null,
  categoryOptions: () => []
})

// Emits
const emit = defineEmits<{
  close: []
  submitMessage: [content: string, tag: number, backgroundColor: string]
  addComment: [content: string]
  like: []
  report: []
}>()

// Store
const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

// 表单数据
const addMessageForm = ref({
  content: '',
  tag: 1,
  backgroundColor: '#ebd4d0'
})
const newComment = ref('')
const isLiked = ref(false)

// 背景色选项
const backgroundColorOptions = ['#ebd4d0', '#efe4fd', '#cbe4e9', '#fef6de', '#e2f7d9']

// 评论相关数据
const commentsContainerRef = ref<HTMLElement>()
const comments = ref<MessageDetailData['comments']['list'][number][]>([])
const totalComments = ref(0)
const currentPage = ref(1)
const isRefreshing = ref(false)
const isLoadingMore = ref(false)
const hasMore = ref(true)

// 下拉刷新功能
const {
  bindEvents,
  unbindEvents
} = usePullToLoad({
  threshold: 60,
  onRefresh: handleRefresh,
  onLoadMore: handleLoadMore,
  hasMore: hasMore,
  isLoading: isRefreshing.value || isLoadingMore
})

// 监听详情数据变化
watch(() => props.messageDetail, (newVal) => {
  if (newVal?.comments?.list) {
    comments.value = newVal.comments.list
    totalComments.value = newVal.comments.total || 0
    currentPage.value = newVal.comments.page || 1
    hasMore.value = currentPage.value < (newVal.comments.totalPage || 1)
  }
}, { immediate: true })

// 监听抽屉可见性变化，重新绑定事件
watch(() => props.visible, async (newVal) => {
  if (newVal) {
    await nextTick()
    if (commentsContainerRef.value) {
      bindEvents(commentsContainerRef.value)
    }
  }
})

// 下拉刷新 - 重新加载第一页
async function handleRefresh() {
  if (isRefreshing.value || !props.messageDetail?.id) return
  
  isRefreshing.value = true
  const startTime = Date.now()
  const minLoadingTime = 600
  
  try {
    const res = await getMessageDetailByIdAPI(props.messageDetail.id, 1)
    
    if (res.code === 0 && res.result) {
      comments.value = res.result.comments.list || []
      totalComments.value = res.result.comments.total || 0
      currentPage.value = res.result.comments.page || 1
      hasMore.value = currentPage.value < (res.result.comments.totalPage || 1)
      
      const elapsedTime = Date.now() - startTime
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime))
      }
      
      $message.success('刷新成功')
    } else {
      $message.error(res.message || '刷新失败')
    }
  } catch {
    $message.error('刷新失败')
  } finally {
    isRefreshing.value = false
  }
}

// 上拉加载更多
async function handleLoadMore() {
  if (isLoadingMore.value || !hasMore.value || !props.messageDetail?.id) return
  
  isLoadingMore.value = true
  const startTime = Date.now()
  const minLoadingTime = 500
  
  try {
    const nextPage = currentPage.value + 1
    const res = await getMessageDetailByIdAPI(props.messageDetail.id, nextPage)
    
    if (res.code === 0 && res.result) {
      const newComments = res.result.comments.list || []
      if (newComments.length > 0) {
        comments.value.push(...newComments)
        currentPage.value = nextPage
        hasMore.value = currentPage.value < (res.result.comments.totalPage || 1)
      } else {
        hasMore.value = false
      }
      
      const elapsedTime = Date.now() - startTime
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime))
      }
    } else {
      $message.error(res.message || '加载更多失败')
    }
  } catch {
    $message.error('加载更多失败')
  } finally {
    isLoadingMore.value = false
  }
}

// 事件处理
const handleOk = () => {
  if (props.isAddMode) {
    submitNewMessage()
  } else {
    handleCancel()
  }
}

const handleCancel = () => {
  resetForm()
  emit('close')
}

const resetForm = () => {
  addMessageForm.value = {
    content: '',
    tag: 1,
    backgroundColor: '#ebd4d0'
  }
  newComment.value = ''
  isLiked.value = false
}

const addComment = () => {
  if (!newComment.value.trim()) return
  emit('addComment', newComment.value)
  newComment.value = ''
}

const handleLike = () => {
  isLiked.value = !isLiked.value
  emit('like')
}

const handleReport = () => {
  emit('report')
}

// 提交留言
const submitNewMessage = async () => {
  if (!addMessageForm.value.content.trim()) return

  try {
    const res = await createMessageAPI({
      content: addMessageForm.value.content,
      tag: addMessageForm.value.tag,
      backgroundColor: addMessageForm.value.backgroundColor
    })

    if (res.code === 0) {
      $message.success(res.message)
      emit('submitMessage', addMessageForm.value.content, addMessageForm.value.tag, addMessageForm.value.backgroundColor)
      resetForm()
      emit('close')
    } else {
      $message.error(res.message)
    }
  } catch {
    $message.error('发布留言失败')
  }
}

// 生命周期
onMounted(async () => {
  await nextTick()
  if (commentsContainerRef.value) {
    bindEvents(commentsContainerRef.value)
  }
})

onUnmounted(() => {
  unbindEvents()
})
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.comments-section-wrapper {
  position: relative;
  height: 400px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.comments-section {
  min-height: 100%;
}

.comments-list {
  min-height: 100%;
}

.no-more {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

/* 隐藏滚动条 */
.comments-section-wrapper::-webkit-scrollbar {
  width: 4px;
}

.comments-section-wrapper::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

/* 原有样式保持不变 */
.drawer-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.detail-container {
  padding: 0;
}

.detail-header {
  padding: 20px;
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.user-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.time {
  font-size: 12px;
  color: #666;
}

.detail-content {
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 12px;
}

.content-text {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 0 4px;
}

.detail-stats {
  display: flex;
  gap: 20px;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.comments-section {
  margin-bottom: 20px;
}

.comments-title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.add-comment {
  margin-top: 20px;
}

.add-comment-title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.comment-input {
  margin-bottom: 12px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.add-container {
  padding: 24px 0;
  width: 100%;
}

.add-form {
  width: 100%;

  .content-input-wrapper {
    border-radius: 20px;
    padding: 32px;
    border: 2px solid #e5e5e5;
    min-height: 400px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    margin: 16px 0;

    .content-textarea {
      background: transparent !important;
      border: none !important;
      font-size: 16px;
      line-height: 1.6;
    }
  }

  .color-picker {
    display: flex;
    gap: $length-22;
    flex-wrap: wrap;
  }

  .color-option {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    border: 0.5px solid transparent;
    transition: all 0.3s ease;

    &.active {
      border-color: #165dff;
      transform: scale(1.15);
    }
  }

  .form-actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    margin-top: $length-20;
  }
}

/* 自定义Arco Comment组件样式 */
:deep(.arco-comment) {
  margin-bottom: 16px;
}

:deep(.arco-comment-content) {
  margin-left: 12px;
}

:deep(.arco-comment-content-author) {
  font-weight: 500;
  color: #333;
}

:deep(.arco-comment-content-datetime) {
  color: #999;
  font-size: 12px;
}

:deep(.arco-comment-content-detail) {
  color: #666;
  line-height: 1.5;
  word-break: break-word;
}
</style>
