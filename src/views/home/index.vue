<template>
  <div class="home-page">
    <TextCursor
      text="💚"
      :delay="0.5"
      :spacing="60"
      :follow-mouse-direction="true"
      :random-float="true"
      :exit-duration="0.8"
      :removal-interval="500"
      :max-points="10"
    />
    <!-- 内容层 -->
    <div class="title">
      <Magnet
        :padding="120"
        :disabled="false"
        :magnet-strength="3"
        active-transition="transform 0.2s ease-out"
        inactive-transition="transform 0.6s ease-in-out"
        wrapper-class-name="custom-wrapper"
        inner-class-name="custom-inner"
      >
        <div class="magnet-element">
          <h1>{{ DockTitle }}</h1>
          <p>值得记录，当然也值得回味。</p>
        </div>
      </Magnet>
    </div>
    <div class="tabs-container">
      <div class="tabs-wrapper">
        <a-tabs
          type="rounded"
          :default-active-key="1"
          lazy-load
          :animation="true"
          class="custom-tabs"
        >
          <a-tab-pane v-for="item in tabsData" :key="item.key" :title="item.title" >
            <!-- 内容区域 -->
            <div class="tab-content">
              <div v-if="loading" class="loading">加载中...</div>
              <div v-else-if="error" class="error">{{ error }}</div>
              <div v-else class="cards-grid">
                <Card
                  v-for="msg in messagesList"
                  :key="msg.id"
                  :item="msg"
                  @click="showDetail(msg.id)"
                />
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>

    <!-- 详情抽屉 -->
    <a-drawer :width="340" :visible="isShowMessageDrawer" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
    <template #title>
      详情
    </template>
    <div>{{ messageDetail?.content }}
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import type { TabsDataItem, MessageType,MessageDetailResponse } from "@/types"; // 引入类型
import { ref, onMounted } from "vue";
import { useSettingStore } from "@/store/setting";
import Magnet from "@/components/MotionEffect/Magnet.vue";
import TextCursor from "@/components/MotionEffect/TextCursor.vue";
import { storeToRefs } from "pinia";
import { tabsDataJSON } from "@/utils/data.json";
import Card from "./components/card.vue";
import { getMessageListAPI,getMessageDetailByIdAPI } from "@/api/home";
const settingStore = useSettingStore();
const { DockTitle, isShowMessageDrawer } = storeToRefs(useSettingStore());
// tabs数据
const tabsData = ref<TabsDataItem[]>(
  tabsDataJSON
)

// 消息列表数据
const messagesList = ref<MessageType[]>([]);
const loading = ref(false);
const error = ref('');

const messageDetail = ref<MessageDetailResponse>()
const handleOk = () => {
  settingStore.toggleMessageDrawer()
  
  };
const handleCancel = () => {
    settingStore.toggleMessageDrawer()
  };

const  showDetail = async (id: number | undefined) => {
  if (id) {
    try {
      const res = await getMessageDetailByIdAPI(id)
      if (res.message === 'success') {
        messageDetail.value=res.data
      }
      settingStore.toggleMessageDrawer()
    }
    catch (error) {
      console.error('获取消息详情失败:', error);
    }
  }
}
// 获取消息列表
const fetchMessageList = async () => {
  try {
    loading.value = true;
    error.value = '';
    const res = await getMessageListAPI();
    if (res.code === 0) {
      messagesList.value = res.data.list;
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
      display: flex; // This was centering content, we want grid
      align-items: center;
      justify-content: center;
      font-size: 16px;
      
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

.loading, .error {
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
