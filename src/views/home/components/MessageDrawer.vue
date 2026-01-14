<template>
  <a-drawer :width="560" :visible="visible" @ok="handleOk" @cancel="handleCancel" unmountOnClose :footer="false">
    <template #title>
      <div class="drawer-title">
        <span>{{ isAddMode ? '新增留言' : '详情' }}</span>
      </div>
    </template>

    <!-- 新增模式 -->
    <div v-if="isAddMode" class="add-container">
      <a-form :model="addForm" layout="vertical" class="add-form">
        <a-form-item label="内容" required>
          <div class="content-input-wrapper" :style="{ backgroundColor: addForm.backgroundColor }">
            <a-textarea v-model="addForm.content" placeholder="分享你的想法..." :rows="12" :max-length="500" show-word-limit
              class="content-textarea" />
          </div>
        </a-form-item>

        <a-form-item label="标签">
          <a-select v-model:value="addForm.tag" placeholder="选择标签">
            <a-option v-for="option in categoryOptions" :key="option.type" :value="option.type">
              {{ option.title }}
            </a-option>
          </a-select>
        </a-form-item>

        <a-form-item label="背景色">
          <div class="color-picker">
            <div v-for="color in backgroundColorOptions" :key="color" class="color-option"
              :class="{ active: addForm.backgroundColor === color }" :style="{ backgroundColor: color }"
              @click="addForm.backgroundColor = color"></div>
          </div>
        </a-form-item>

        <a-form-item>
          <div class="form-actions">
            <a-button @click="handleCancel">取消</a-button>
            <a-button type="primary" @click="submitNewMessage" :disabled="!addForm.content.trim()">
              发布
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>

    <!-- 详情模式 -->
    <div class="detail-container" v-else-if="messageDetail && Object.keys(messageDetail).length > 0">
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
      <div class="comments-section" v-if="messageDetail.comments && messageDetail.comments.list && messageDetail.comments.list.length > 0">
        <a-divider orientation="left">
          <span class="comments-title">评论 {{ messageDetail.comments.total }}</span>
        </a-divider>

        <a-comment v-for="(comment, index) in messageDetail.comments.list" :key="index" :author="comment.nickname || comment.username"
          :datetime="formatTime(comment.time)" :content="comment.content">
          <template #avatar>
            <FanAvatar :imageUrl="comment.avatar" :username="comment.nickname || comment.username" />
          </template>
        </a-comment>
      </div>

      <!-- 添加评论 -->
      <div class="add-comment">
        <a-divider orientation="left">
          <span class="add-comment-title">添加评论</span>
        </a-divider>
        <a-comment>
          <template #avatar>
            <a-avatar>U</a-avatar>
          </template>
          <template #content>
            <a-textarea v-model:value="newComment" placeholder="请输入评论..." :rows="3" :max-length="200" show-word-limit
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
import { ref, watch } from 'vue'
import { $message } from '@/hooks/useMessage'
import AppIcon from '@/components/AppIcon.vue'
import FanAvatar from './Fan-Avatar.vue'
import type { CategoryOption, MessageDetailData } from '@/types'
import { createMessageAPI } from '@/api/home'
import { formatTime } from '@/utils'

// 定义props
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

// 定义emits
const emit = defineEmits<{
  close: []
  submitMessage: [content: string, tag: number, backgroundColor: string]
  addComment: [content: string]
  like: []
  report: []
}>()

// 响应式数据
const addForm = ref({
  content: '',
  tag: 1,
  backgroundColor: '#ebd4d0'
})

const newComment = ref('')
const isLiked = ref(false)

// 背景色选项
const backgroundColorOptions = [
  '#ebd4d0',
  '#efe4fd',
  '#cbe4e9',
  '#fef6de',
  '#e2f7d9'
]



// 事件处理函数
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
  addForm.value = {
    content: '',
    tag: 1,
    backgroundColor: '#ebd4d0'
  }
  newComment.value = ''
  isLiked.value = false
}

// 提交新增留言
const submitNewMessage = async () => {
  if (!addForm.value.content.trim()) {
    console.warn('请输入内容')
    return
  }

  try {
    const res = await createMessageAPI({
      content: addForm.value.content,
      tag: addForm.value.tag,
      backgroundColor: addForm.value.backgroundColor
    })

    if (res.code === 0) {
      $message.success(res.message)
      emit('submitMessage', addForm.value.content, addForm.value.tag, addForm.value.backgroundColor)
      resetForm()
      emit('close')
    } else {
      $message.error(res.message)
    }
  } catch {
    $message.error('发布留言失败')
  }
}

// 添加评论功能
const addComment = () => {
  if (!newComment.value.trim()) return
  
  emit('addComment', newComment.value)
  newComment.value = ''
}

// 点赞功能
const handleLike = () => {
  isLiked.value = !isLiked.value
  emit('like')
}

// 举报功能
const handleReport = () => {
  emit('report')
}

// 监听visible变化，重置表单
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<style scoped lang="scss">
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
  position: relative;
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

  :hover {
    cursor: pointer;
  }
}

.stat-item .anticon {
  color: #ff6b6b;
}

.comments-section {
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
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

  .arco-form-item {
    margin-bottom: 10px;

    :deep(.arco-form-item-label) {
      font-size: $font-size-20;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }
  }

  .content-input-wrapper {
    border-radius: 20px;
    padding: 32px;
    transition: background-color 0.3s ease;
    border: 2px solid #e5e5e5;
    min-height: 400px;
    width: 100%;
    max-width: none;
    position: relative;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    margin: 16px 0;

    .content-textarea {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      font-size: 16px;
      line-height: 1.6;
      resize: none;

      &:focus {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }

      :deep(.arco-textarea) {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        font-size: $font-size-16;
        line-height: 1.8;
        padding: 0;
        min-height: 320px;
        width: 100%;

        &::placeholder {
          color: rgba(0, 0, 0, 0.45);
          font-size: $font-size-20;
        }
      }

      :deep(.arco-textarea-word-limit) {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 8px;
        padding: 6px 12px;
        margin-top: 16px;
        font-size: 12px;
        color: #666;
        border: 1px solid rgba(0, 0, 0, 0.1);
        position: absolute;
        bottom: 20px;
        right: 20px;
        backdrop-filter: blur(4px);
      }
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
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.8);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    &.active {
      border-color: #165dff;
      transform: scale(1.15);
      box-shadow: 0 4px 16px rgba(22, 93, 255, 0.4);

      &::after {
        opacity: 1;
      }
    }
  }

  .form-actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    margin-top: $length-20;

    .arco-btn {
      height: 40px;
      padding: 0 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

/* 滚动条样式 */
.comments-section::-webkit-scrollbar {
  width: 4px;
}

.comments-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.comments-section::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.comments-section::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
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
