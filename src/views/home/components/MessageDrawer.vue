<template>
  <a-drawer 
    :width="drawerWidth" 
    :visible="visible" 
    @ok="handleOk" 
    @cancel="handleCancel" 
    unmountOnClose 
    :footer="false"
    :closable="!isMobile"  
    class="mobile-optimized-drawer"
  >
  <!-- 自定义关闭按钮 - 只在移动端显示 -->
    <a-button 
      v-if="isMobile"
      type="text" 
      class="close-btn" 
      @click="handleCancel"
      size="small"
    >
      <AppIcon name="mdi:close" :size="20" />
    </a-button>
    
    <template #title>
      <div class="drawer-title">
        <span>{{ isAddMode ? '新增留言' : '详情' }}</span>
      </div>
    </template>

    <!-- 新增模式 -->
    <div v-if="isAddMode" class="add-container">
      <div class="add-form">
        <div class="form-section">
          <div class="form-label">
            <span class="label-text">内容</span>
            <span class="label-required">*</span>
          </div>
          <div class="content-input-wrapper" :style="{ backgroundColor: addMessageForm.backgroundColor }">
            <a-textarea
              v-model="addMessageForm.content" 
              placeholder="分享你的想法，记录美好时光..."
              :rows="12"
              :max-length="500"
              show-word-limit
              class="content-textarea"
              allow-clear
            />
          </div>
        </div>

        <div class="form-section">
          <div class="form-label">
            <span class="label-text">标签</span>
          </div>
          <a-select
            v-model:value="addMessageForm.tag"
            placeholder="选择标签"
            class="tag-select"
          >
            <a-option v-for="option in filteredCategoryOptions" :key="option.type" :value="option.type">
              {{ option.title }}
            </a-option>
          </a-select>
        </div>

        <div class="form-section">
          <div class="form-label">
            <span class="label-text">背景色</span>
          </div>
          <div class="color-picker">
            <div 
              v-for="color in backgroundColorOptions" 
              :key="color" 
              class="color-option"
              :class="{ active: addMessageForm.backgroundColor === color }" 
              :style="{ backgroundColor: color }"
              @click="addMessageForm.backgroundColor = color"
            >
              <AppIcon v-if="addMessageForm.backgroundColor === color" name="mdi:check" :size="16" color="#fff" />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <a-button @click="handleCancel" class="cancel-btn">
            取消
          </a-button>
          <a-button
            type="primary"
            @click="submitNewMessage" 
            :disabled="!addMessageForm.content.trim()"
            class="submit-btn"
          >
            <template #icon>
              <AppIcon name="mdi:send" :size="16" />
            </template>
            发布
          </a-button>
        </div>
        
        <div class="form-decorations">
          <div class="decoration-circle decoration-1"></div>
          <div class="decoration-circle decoration-2"></div>
          <div class="decoration-circle decoration-3"></div>
          <div class="decoration-text">
            <AppIcon name="mdi:sparkles" :size="16" color="#165dff" />
            <span>分享你的美好时光</span>
          </div>
        </div>
      </div>
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
          <div class="like-button-container">
            <AppIcon name="mdi:heart" :size="26" :color="isLiked ? '#ff4757' : '#999'" :style="{ transition: 'all 0.3s ease', transform: isLiked ? 'scale(1.2)' : 'scale(1)' }" />
            <div class="heart-particles" ref="heartParticles"></div>
          </div>
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

          <!-- 敏感词检查提示 -->
          <div class="sensitive-word-tip">
            <AppIcon name="mdi:shield-check" :size="14" color="#165dff" />
            <span>评论由 </span>
            <a href="https://uapis.cn/" target="_blank" class="uapi-link">UApiPro</a>
            <span> 提供敏感词检查</span>
          </div>

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
        <div class="add-comment-header">
          <span class="add-comment-title">添加评论</span>
        </div>
        <a-comment>
          <template #avatar>
            <FanAvatar :size="36" :imageUrl="userInfo?.avatar" :username="userInfo?.nickname || userInfo?.username" />
          </template>
          <template #content>
            <a-textarea 
              v-model="newComment" 
              placeholder="写下你的想法..." 
              :rows="3" 
              :max-length="200" 
              show-word-limit
              class="comment-input"
              allow-clear
            />
            <div class="comment-footer">
              <span class="comment-hint">分享你的想法，与大家互动</span>
              <a-button 
                type="primary" 
                size="small" 
                @click="addComment" 
                :disabled="!newComment.trim()"
                class="submit-comment-btn"
              >
                <template #icon>
                  <AppIcon name="mdi:send" :size="14" />
                </template>
                发送
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
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'
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

// 移动端检测
const isMobile = ref(false)
const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 响应式抽屉宽度
const drawerWidth = computed(() => {
  if (isMobile.value) {
    return '100%' // 移动端全屏
  }
  return 560 // PC端固定宽度
})

// 过滤掉type为0的选项，只保留1,2,3,4
const filteredCategoryOptions = computed(() => {
  return props.categoryOptions.filter(option => option.type !== 0)
})

// Emits
const emit = defineEmits<{
  close: []
  submitMessage: [content: string, tag: number, backgroundColor: string]
  addComment: [content: string]
  like: [id: number]
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

// 点赞特效相关
const heartParticles = ref<HTMLElement>()

// 创建心形粒子特效
const createHeartParticles = () => {
  if (!heartParticles.value) return
  
  const particleCount = 12
  const colors = ['#ff6b6b', '#ff8787', '#ffa8a8', '#ffc9c9', '#ffe3e3']
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'heart-particle'
    
    const angle = (i / particleCount) * Math.PI * 2
    const distance = 30 + Math.random() * 20
    const duration = 0.6 + Math.random() * 0.4
    const delay = Math.random() * 0.1
    const size = 8 + Math.random() * 8
    const color = colors[Math.floor(Math.random() * colors.length)]
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: particle-explode ${duration}s ease-out ${delay}s forwards;
      box-shadow: 0 0 ${size}px ${color};
    `
    
    heartParticles.value.appendChild(particle)
    
    setTimeout(() => {
      particle.remove()
    }, (duration + delay) * 1000)
  }
}

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
  if (!props.messageDetail) return
  if (isLiked.value) return
  isLiked.value = true
  createHeartParticles()
  emit('like', props.messageDetail.id)
}

const handleReport = () => {
  emit('report')
}

// 提交留言
const submitNewMessage = async () => {
  if (!addMessageForm.value.content.trim()) return
  console.log(addMessageForm.value.tag);
  
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
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
  await nextTick()
  if (commentsContainerRef.value) {
    bindEvents(commentsContainerRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
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

.like-button-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heart-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  pointer-events: none;
}

@keyframes particle-explode {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }
}

.comments-section {
  margin-bottom: 20px;
}

.sensitive-word-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #f0f7ff;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  margin-bottom: 16px;

  .uapi-link {
    color: #165dff;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}

.comments-title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.add-comment {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.add-comment-header {
  margin-bottom: 16px;
}

.add-comment-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: 0.02em;
}

.comment-input {
  margin-bottom: 12px;
  border-radius: 12px;
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px;
}

.comment-hint {
  font-size: 12px;
  color: #9ca3af;
  letter-spacing: 0.01em;
}

.submit-comment-btn {
  height: 32px;
  padding: 0 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.label-text {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: 0.01em;
}

.label-required {
  color: #ef4444;
  font-size: 14px;
  font-weight: 600;
}

.content-input-wrapper {
  border-radius: 16px;
  padding: 24px;
  border: 2px solid transparent;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
}

.content-textarea {
  background: transparent !important;
  border: none !important;
  font-size: 16px;
  line-height: 1.8;
  color: #1f2937;
  resize: none;
  position: relative;
  z-index: 1;

  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
}

.tag-select {
  width: 100%;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
  }

  &:focus-within {
    border-color: #165dff;
    box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.1);
  }
}

.color-picker {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.color-option {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &.active {
    border-color: #165dff;
    transform: scale(1.15);
    box-shadow: 0 4px 16px rgba(22, 93, 255, 0.3);
  }
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.cancel-btn {
  height: 40px;
  padding: 0 24px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
}

.submit-btn {
  height: 40px;
  padding: 0 28px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(22, 93, 255, 0.35);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.form-decorations {
  position: relative;
  margin-top: 40px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.decoration-1 {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #165dff 0%, #4096ff 100%);
  left: 10%;
  animation-delay: 0s;
}

.decoration-2 {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
  right: 15%;
  animation-delay: 2s;
}

.decoration-3 {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  left: 50%;
  bottom: 0;
  animation-delay: 4s;
}

.decoration-text {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
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

/* 移动端优化样式 */
@media (max-width: 768px) {
  /* 抽屉头部优化 */
  .close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1000;
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    &:hover {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  /* 移动端标题区域添加右边距给关闭按钮留空间 */
  :deep(.arco-drawer-header) {
    position: relative;
    padding-right: 60px; /* 给关闭按钮留空间 */
  }

  /* 详情模式移动端优化 */
  .detail-header {
    padding: 16px;
    margin-bottom: 12px;
    position: relative; /* 为标签定位做准备 */
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-right: 40px; /* 给关闭按钮留空间 */
  }

  .user-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* 标签位置调整 */
  .detail-header :deep(.arco-tag) {
    position: absolute;
    top: 16px;
    right: 50px; /* 在关闭按钮左边 */
  }

  .detail-content {
    padding: 16px;
    margin: 0 16px 16px;
    border-radius: 12px;
  }

  .content-text {
    font-size: 15px;
    line-height: 1.7;
  }

  .detail-stats {
    padding: 12px 16px;
    margin: 0 16px 16px;
    gap: 16px;
  }

  .stat-item {
    font-size: 13px;
    gap: 4px;
  }

  /* 评论区移动端优化 */
  .comments-section-wrapper {
    height: 50vh; /* 移动端使用视窗高度 */
    max-height: 400px;
  }

  .comments-section {
    padding: 0 16px;
  }

  .sensitive-word-tip {
    padding: 6px 10px;
    font-size: 11px;
    margin-bottom: 12px;
  }

  /* 新增评论区域优化 */
  .add-comment {
    padding: 16px;
    margin-top: 16px;
  }

  .add-comment-header {
    margin-bottom: 12px;
  }

  .comment-input {
    margin-bottom: 8px;
  }

  .comment-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .comment-hint {
    font-size: 11px;
  }

  .submit-comment-btn {
    align-self: flex-end;
    height: 36px;
    padding: 0 20px;
  }

  /* 新增模式移动端优化 */
  .add-container {
    padding: 16px 0;
  }

  .add-form {
    gap: 16px;
  }

  .form-section {
    gap: 8px;
  }

  .content-input-wrapper {
    padding: 16px;
    border-radius: 12px;
  }

  .content-textarea {
    font-size: 15px;
  }

  .form-actions {
    padding: 12px 0 0;
    margin-top: 4px;
  }

  .cancel-btn,
  .submit-btn {
    height: 44px;
    padding: 0 20px;
    font-size: 15px;
  }

  /* 颜色选择器优化 */
  .color-picker {
    gap: 12px;
  }

  .color-option {
    width: 40px;
    height: 40px;
  }

  /* 评论列表优化 */
  :deep(.arco-comment) {
    margin-bottom: 12px;
  }

  :deep(.arco-comment-content) {
    margin-left: 8px;
  }

  :deep(.arco-comment-content-author) {
    font-size: 13px;
  }

  :deep(.arco-comment-content-datetime) {
    font-size: 11px;
  }

  :deep(.arco-comment-content-detail) {
    font-size: 14px;
    line-height: 1.6;
  }
}

@media (max-width: 480px) {
  /* 超小屏幕优化 */
  .detail-header,
  .detail-content,
  .detail-stats,
  .comments-section,
  .add-comment {
    padding-left: 12px;
    padding-right: 12px;
  }

  .comments-section-wrapper {
    height: 45vh;
  }

  .drawer-title {
    font-size: 16px;
  }

  .content-text {
    font-size: 14px;
  }

  .form-decorations {
    padding: 16px 12px;
  }

  .decoration-circle {
    display: none; /* 超小屏幕隐藏装饰元素 */
  }
}
</style>
