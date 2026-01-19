<template>
  <div class="photo-page">
    <div class="photo-header">
      <h1>照片墙</h1>
      <p>记录每一个精彩瞬间</p>
    </div>

    <SkeletonList :count="12" list-class="grid-layout" v-if="isLoading && mediaList.length === 0" />
<div class="tabs-wrapper">
<a-tabs type="rounded" :default-active-key="currentCategory" lazy-load :animation="true" class="custom-tabs" @change="handleTabChange" >
   <a-tab-pane v-for="item in categoryOptions" :key="item.category" :title="item.title">
    <div v-if="isError && !isLoading" class="error-message">
      <div class="error-icon">⚠️</div>
      <div class="error-text">加载照片失败，请稍后重试</div>
      <button class="retry-button" @click="loadPhotos()">重试</button>
    </div>

    <SimpleWaterfall :items="mediaList" @item-click="handleItemClick"
      v-if="!isError && !isLoading || mediaList.length > 0" />
</a-tab-pane>
  </a-tabs>
</div>
  </div>
</template>

<script setup lang="ts">
import SkeletonList from '@/components/skeleton/SkeletonList.vue';
import SimpleWaterfall from '@/components/SimpleWaterfall.vue';
import type { CategoryOptionForPhoto, MediaItemType } from '@/types';
import { ref, onMounted } from 'vue';
import { getPhotoListAPI } from '@/api/photo';
import { $notification } from '@/hooks/useNotification';
const mediaList = ref<MediaItemType[]>([])
const isLoading = ref(true)
const isError = ref(false)
const page = ref(1)
const total = ref(0)
const totalPage = ref(0)
// const filterCategory = ref(2)
const keyword = ref('')
const type = ref(0)
const currentCategory = ref(0)
// 统一的分类数据
const categoryOptions = ref<CategoryOptionForPhoto[]>([
  { category: 0, title: "全部", text: "all" },
  { category: 1, title: "好看", text: "good" },
  { category: 2, title: "风景", text: "landscape" },
  { category: 3, title: "图片", text: "photo" },
  { category: 4, title: "视频", text: "video" }
])
// 加载照片数据
const loadPhotos = async (filterCategory: number=0) => {
  try {
    isLoading.value = true
    isError.value = false
    const response = await getPhotoListAPI(page.value, filterCategory, keyword.value, type.value)
    if (response.code === 0 && response.result) {
      mediaList.value = response.result.list
      total.value = response.result.total
      totalPage.value = response.result.totalPage
    } else {
      isError.value = true
    }
  } catch {
    $notification.error({
      title: '错误',
      content: '加载照片失败，请稍后重试'
    })
    isError.value = true
  } finally {
    isLoading.value = false
  }
}
// 切换标签时的处理
const handleTabChange = (key: string | number) => {
  currentCategory.value = Number(key)
  // 重置到第一页
  page.value = 1
  // 根据选中的分类获取对应的数据
  loadPhotos(Number(key))
}

const handleItemClick = (item: MediaItemType) => {
  console.log('点击了卡片:', item)
  // 这里可以处理跳转到详情页的逻辑
  // 例如: router.push(`/photo/${item.id}`)
  alert(`点击了: ${item.title} (ID: ${item.id})`)
}

// 组件挂载时加载数据
onMounted(() => {
  loadPhotos()
})
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";
.tabs-wrapper {
  width: 100%;
  overflow-x: hidden;
  position: relative;
}

.photo-page {
  min-height: calc(100vh - 20px);
  padding: $padding-24;
  overflow-x: hidden;
  box-sizing: border-box;

  .photo-header {
    text-align: center;
    margin-bottom: $padding-24;
    max-width: 100%;
    overflow: hidden;

    h1 {
      font-size: $font-size-28;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0 0 $padding-8;
    }

    p {
      font-size: $font-size-14;
      color: var(--color-text-tertiary);
      margin: 0;
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
  .error-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;

    .error-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .error-text {
      font-size: $font-size-16;
      color: var(--color-text-secondary);
      margin-bottom: 24px;
    }

    .retry-button {
      padding: 10px 24px;
      background: var(--color-primary);
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: $font-size-14;
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: var(--color-primary-hover);
      }
    }
  }
}
</style>
