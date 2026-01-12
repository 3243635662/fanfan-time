<template>
  <div class="home-page">
    <TextCursor v-if="isShowTextCursor" text="💚" :delay="0.5" :spacing="60" :follow-mouse-direction="true"
      :random-float="true" :exit-duration="0.8" :removal-interval="500" :max-points="10" />
    <!-- 内容层 -->
    <div class="title">
      <Magnet :padding="120" :disabled="false" :magnet-strength="3" active-transition="transform 0.2s ease-out"
        inactive-transition="transform 0.6s ease-in-out" wrapper-class-name="custom-wrapper"
        inner-class-name="custom-inner">
        <div class="magnet-element">
          <h1>{{ DockTitle }}</h1>
          <p>值得记录，当然也值得回味。</p>
        </div>
      </Magnet>
    </div>
    <div class="tabs-container">
      <div class="tabs-wrapper">
        <a-tabs type="rounded" :default-active-key="currentCategory" lazy-load :animation="true" class="custom-tabs" @change="handleTabChange">
          <a-tab-pane v-for="item in categoryOptions" :key="item.type" :title="item.title">
            <!-- 内容区域 -->
            <div class="tab-content">
              <div v-if="loading" class="loading">加载中...</div>
              <div v-else-if="error" class="error">{{ error }}</div>
              <div v-else class="cards-grid">
                <Card v-for="msg in messagesList" :key="msg.id" :item="msg" @click="showDetail(msg.id)" />
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>

  <!-- 抽屉 -->
  <a-drawer :width="560" :visible="isShowMessageDrawer" @ok="handleOk" @cancel="handleCancel" unmountOnClose
    :footer="false">
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
import { $message } from "@/hooks/useMessage";
import AppIcon from "@/components/AppIcon.vue";
import type { CategoryOption, MessageType, MessageListResponse, MessageDetailData } from "@/types"; // 引入类型
import { ref, onMounted } from "vue";
import { useSettingStore } from "@/store/setting";
import Magnet from "@/components/MotionEffect/Magnet.vue";
import TextCursor from "@/components/MotionEffect/TextCursor.vue";
import { storeToRefs } from "pinia";
import Card from "./components/card.vue";
import FanAvatar from "./components/Fan-Avatar.vue";
import { getMessageListAPI, getMessageDetailByIdAPI, createMessageAPI } from "@/api/home";
const settingStore = useSettingStore();
const { DockTitle, isShowMessageDrawer, isAddMode, isShowTextCursor } = storeToRefs(settingStore);
// 统一的分类数据
const categoryOptions = ref<CategoryOption[]>([
  { type: 1, title: "全部", text: "all" },
  { type: 2, title: "理想", text: "ideal" },
  { type: 3, title: "学业", text: "academic" },
  { type: 4, title: "生活", text: "life" },
  { type: 5, title: "其他", text: "other" }
])

// 当前选中的分类
const currentCategory = ref(1)

// 消息列表数据
const messagesList = ref<MessageType[]>([]);
const loading = ref(false);
const error = ref('');

const messageDetail = ref<MessageDetailData | null>(null)
const newComment = ref('')

// 时间格式化函数
const formatTime = (time: Date | string) => {
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}

// 点赞状态
const isLiked = ref(false)

// 新增表单数据
const addForm = ref({
  content: '',
  tag: 1,
  backgroundColor: '#ebd4d0'
})
// 重置以及关闭
const resetAndClose = () => {
  messageDetail.value = null
  newComment.value = ''
  addForm.value = {
    content: '',
    tag: 1, // 重置为默认ID
    backgroundColor: '#ebd4d0'
  }
  settingStore.closeDrawer()
}

// 背景色选项
const backgroundColorOptions = [
  '#ebd4d0',
  '#efe4fd',
  '#cbe4e9',
  '#fef6de',
  '#e2f7d9'
]

const handleOk = () => {
  if (isAddMode.value) {
    // 处理新增逻辑
    submitNewMessage()
  } else {
    // 处理详情关闭
    resetAndClose()
  }
};

const handleCancel = () => {
  resetAndClose()
};

// 切换标签时的处理
const handleTabChange = (key: string | number) => {
  currentCategory.value = Number(key)
  // 根据选中的分类获取对应的数据
  getMessageList()
}


// 提交新增留言
const submitNewMessage = async () => {
  if (!addForm.value.content.trim()) {
    console.warn('请输入内容')
    return
  }

  try {
    // 调用API提交数据
    const res = await createMessageAPI({
      content: addForm.value.content,
      tag: addForm.value.tag,
      backgroundColor: addForm.value.backgroundColor
    })

    if (res.code === 0) {
      $message.success(res.message)
      // 刷新列表
      await fetchMessageList()
      resetAndClose()
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

  const comment = {
    id: Date.now(), // 使用时间戳作为临时ID
    username: '当前用户', // 这里可以从用户状态获取
    time: new Date(),
    content: newComment.value,
    avatar: 'https://via.placeholder.com/40x40?text=U'
  }
  if (!messageDetail.value) return
  
  if (!messageDetail.value.comments) {
    messageDetail.value.comments = {
      list: [],
      totalPage: 0,
      total: 0,
      page: 1,
      limit: 10
    }
  }

  messageDetail.value.comments.list.unshift(comment)
  if (messageDetail.value.commentCount !== undefined) {
    messageDetail.value.commentCount++
  }
  if (messageDetail.value.comments.total !== undefined) {
    messageDetail.value.comments.total++
  }

  newComment.value = ''
  console.log('评论已添加:', comment)
};

// 点赞功能
const handleLike = () => {
  if (!messageDetail.value) return
  
  isLiked.value = !isLiked.value

  if (isLiked.value) {
    // 点赞
    if (messageDetail.value.likedCount !== undefined) {
      messageDetail.value.likedCount++
    }
    console.log('点赞成功')
    // TODO: 调用点赞API
  } else {
    // 取消点赞
    if (messageDetail.value.likedCount !== undefined && messageDetail.value.likedCount > 0) {
      messageDetail.value.likedCount--
    }
    console.log('取消点赞')
    // TODO: 调用取消点赞API
  }
}

// 举报功能
const handleReport = () => {
  if (!messageDetail.value) return
  
  console.log('举报留言:', messageDetail.value.id)
  // TODO: 调用举报API
  // 这里可以添加举报成功的提示
}

// 获取详情
const showDetail = async (id: number | undefined) => {
  if (id) {
    try {
      console.log('获取消息详情:', id);
      
      const res = await getMessageDetailByIdAPI(id)
      if (res.code === 0 && res.result) {
        messageDetail.value = res.result
        // 重置点赞状态
        isLiked.value = false
        // 打开详情抽屉
        isShowMessageDrawer.value = true
      } else {
        $message.error(res.message || '获取数据失败')
      }
    }
    catch (error) {
      console.error('获取消息详情失败:', error);
    }
  }
  console.log(messageDetail.value);
  
}

// 获取消息列表（根据分类）
const getMessageList = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // 直接传入当前选中的分类id作为type，后端数据库使用数字类型的type字段
    const res: MessageListResponse = await getMessageListAPI(currentCategory.value);
    if (res.code === 0 && res.result) {
      messagesList.value = res.result.list || [];
    } else {
      error.value = res.message || '获取数据失败';
    }
  } catch (err) {
    console.error('获取消息列表失败:', err);
    error.value = '网络请求失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

// 获取全部消息列表（兼容原有逻辑）
const fetchMessageList = async () => {
  await getMessageList();
};

// 组件挂载时获取数据
onMounted(() => {
  fetchMessageList();
});



</script>

<style scoped lang="scss">
.home-page {
  position: relative;
  min-height: calc(100vh - 20px);
  overflow: hidden;

  .title {
    position: relative;
    z-index: 1;
    margin-bottom: 20px;
    padding: $padding-16;
    text-align: center;

    h1 {
      font-size: 1.6rem;
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    p {
      font-size: 12px;
      opacity: 0.8;
    }
  }
}

.tabs-container {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $padding-16;
  margin-bottom: 20px;

  .tabs-wrapper {
    width: 100%;

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

    .tab-content {
      padding: 24px;
      min-height: 200px;
      font-size: 16px;

      .add-button-container {
        display: flex;
        justify-content: center;
        margin-bottom: 24px;

        .add-button {
          border-radius: 24px;
          height: 48px;
          padding: 0 24px;
          font-size: 16px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(22, 93, 255, 0.4);
          }
        }
      }

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
      }
    }
  }
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 16px;
}

.error {
  color: #f56565;
}

.loading {
  color: #666;
}

/* 详情抽屉样式 */
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

/* 内容输入框样式 */
.content-input-wrapper {
  border-radius: 12px;
  padding: 16px;
  transition: background-color 0.3s ease;
  border: 1px solid #e5e5e5;

  .content-textarea {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;

    &:focus {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
    }

    :deep(.arco-textarea) {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;

      &:focus {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
    }

    :deep(.arco-textarea-word-limit) {
      background: rgba(255, 255, 255, 0.8);
      border-radius: 4px;
      padding: 2px 6px;
      margin-top: 8px;
    }
  }
}
</style>
