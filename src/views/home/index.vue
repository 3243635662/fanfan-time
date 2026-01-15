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
                <!-- 添加分页 -->
              <div v-else>
                <div class="cards-grid">
                  <Card v-for="msg in messagesList" :key="msg.id" :item="msg" @click="showDetail(msg.id)" />
                </div>
                <div class="pagination-container">
                  <a-pagination
                  :total="pageInfo.total"
                  :current="pageInfo.current"
                  :page-size="pageInfo.limit"
                  :page-size-options="[12, 16, 20, 24, 28, 32]"
                  show-total
                  show-jumper
                  show-page-size
                  @change="handlePageChange"
                  @page-size-change="handlePageSizeChange"
                />
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>

  <!-- 异步加载的抽屉组件 -->
  <component
    :is="MessageDrawer"
    v-if="isShowMessageDrawer"
    :visible="isShowMessageDrawer"
    :is-add-mode="isAddMode"
    :message-detail="messageDetail"
    :category-options="categoryOptions"
    @close="handleDrawerClose"
    @submit-message="handleMessageSubmit"
    @addComment="handleAddComment"
    @like="handleLike"
    @report="handleReport"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { $message } from '@/hooks/useMessage'
import type { CategoryOption, MessageType, MessageListResponse, MessageDetailData } from '@/types'
import { useSettingStore } from '@/store/setting'
import { storeToRefs } from 'pinia'
import Magnet from '@/components/MotionEffect/Magnet.vue'
import TextCursor from '@/components/MotionEffect/TextCursor.vue'
import Card from './components/card.vue'
import { getMessageListAPI, getMessageDetailByIdAPI ,addCommentAPI} from '@/api/home'
import { $notification } from '@/hooks/useNotification'
// 异步组件加载抽屉组件
const MessageDrawer = defineAsyncComponent(() =>
  import('./components/MessageDrawer.vue')
)

const settingStore = useSettingStore()
const { DockTitle, isShowMessageDrawer, isAddMode, isShowTextCursor } = storeToRefs(settingStore)
const pageInfo = ref({
  current: 1,
  total: 0,
  limit: 12,
  totalPage: 0
})
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
const messagesList = ref<MessageType[]>([])
const loading = ref(false)
const error = ref('')

const messageDetail = ref<MessageDetailData | null>(null)


// 处理抽屉关闭
const handleDrawerClose = () => {
  settingStore.closeDrawer()
  messageDetail.value = null
}

// 处理消息提交成功
const handleMessageSubmit = () => {
  // 刷新列表
  getMessageList()
}

// 处理添加评论  (只需要传递messageId,content即可)
const  handleAddComment = async(content: string) => {
  if (!messageDetail.value) return

  try {
    const res = await addCommentAPI({
      messageId: messageDetail.value.id,
      content
    })
    if (res.code === 0) {
      $notification.success({
        title: '评论成功',
        content: res.message || '评论成功'
      })
      // 刷新详情数据
      const detailRes = await getMessageDetailByIdAPI(messageDetail.value.id)
      if (detailRes.code === 0 && detailRes.result) {
        messageDetail.value = detailRes.result
      }
    }
    else{
      $notification.error({
        title: '评论失败',
        content: res.message || '评论失败'
      })
    }
  } catch (error) {
    console.error('添加评论失败:', error)
    $notification.error({
      title: '评论失败',
      content: '网络请求失败，请稍后重试'
    })
  }
}

// 处理点赞
const handleLike = () => {
  if (!messageDetail.value) return
  
  // 这里可以根据实际需求处理点赞逻辑
  // 目前只是简单的前端状态更新
}

// 处理举报
const handleReport = () => {
  if (!messageDetail.value) return
  
  console.log('举报留言:', messageDetail.value.id)
  // TODO: 调用举报API
}

// 切换标签时的处理
const handleTabChange = (key: string | number) => {
  currentCategory.value = Number(key)
  // 重置到第一页
  pageInfo.value.current = 1
  // 根据选中的分类获取对应的数据
  getMessageList()
}

// 获取详情
const showDetail = async (id: number | undefined) => {
  if (id) {
    try {
      console.log('获取消息详情:', id)
      
      const res = await getMessageDetailByIdAPI(id)
      if (res.code === 0 && res.result) {
        messageDetail.value = res.result
        // 打开详情抽屉
        settingStore.openDetailMode()
      } else {
        $message.error(res.message || '获取数据失败')
      }
    }
    catch (error) {
      console.error('获取消息详情失败:', error)
    }
  }
}

// 处理页码改变
const handlePageChange = (page: number) => {
  pageInfo.value.current = page
  getMessageList()
}

// 处理每页条数改变
const handlePageSizeChange = (pageSize: number) => {
  pageInfo.value.limit = pageSize
  pageInfo.value.current = 1 // 重置到第一页
  getMessageList()
}

// 获取消息列表（根据分类）
const getMessageList = async (page: number = pageInfo.value.current, limit: number = pageInfo.value.limit) => {
  try {
    loading.value = true
    error.value = ''
    
    // 直接传入当前选中的分类id作为type，后端数据库使用数字类型的type字段
    const res: MessageListResponse = await getMessageListAPI(currentCategory.value, page, limit)
    if (res.code === 0 && res.result) {
      messagesList.value = res.result.list || []
      pageInfo.value.current = res.result.page || 1  // 使用page而不是current
      pageInfo.value.total = res.result.total || 0
      pageInfo.value.limit = res.result.limit || 12
      pageInfo.value.totalPage = res.result.totalPage || 0
    } else {
      error.value = res.message || '获取数据失败'
    }
  } catch (err) {
    console.error('获取消息列表失败:', err)
    error.value = '网络请求失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getMessageList()
})
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

      .pagination-container {
        display: flex;
        justify-content: center;
        margin-top: 40px;
        padding: 20px 0;
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
</style>
