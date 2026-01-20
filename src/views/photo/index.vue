<template>
  <div class="photo-page">
    <div class="photo-header">
      <h1>照片墙</h1>
      <p>记录每一个精彩瞬间</p>
    </div>

    <div class="search-container">
      <div class="search-box">
        <input
          v-model="keyword"
          type="text"
          placeholder="搜索照片..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button class="search-button" @click="handleSearch">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>
    </div>
    <SkeletonList :count="isMobile() ? 8 : 12" list-class="grid-layout" v-if="isLoading && mediaList.length === 0" />
    <div class="tabs-wrapper">
      <a-tabs type="rounded" :default-active-key="currentCategory" lazy-load :animation="true" class="custom-tabs" @change="handleTabChange" >
        <a-tab-pane v-for="item in categoryOptions" :key="item.category" :title="item.title">
          <div v-if="isError && !isLoading" class="error-message">
            <div class="error-icon">⚠️</div>
            <div class="error-text">加载照片失败，请稍后重试</div>
            <button class="retry-button" @click="loadPhotos()">重试</button>
          </div>

          <div v-if="showEmptySearch" class="empty-search-message">
            <div class="empty-search-icon">🔍</div>
            <div class="empty-search-text">没有找到相关照片</div>
            <div class="empty-search-hint">换个关键词试试吧</div>
            <button class="clear-search-button" @click="clearSearch">清除搜索</button>
          </div>

          <SocialWaterfall
            :items="mediaList"
            :loading="isLoading"
            :no-more="page >= totalPage && totalPage > 0"
            @load-more="loadMorePhotos"
            @like="handleLike"
            @comment="handleComment"
            @share="handleShare"
            v-if="!isError || mediaList.length > 0" />
        </a-tab-pane>
      </a-tabs>
    </div>

    <PostDetailModal />
  </div>
</template>

<script setup lang="ts">
import SkeletonList from '@/components/skeleton/SkeletonList.vue';
import SocialWaterfall from '@/components/SocialWaterfall.vue';
import PostDetailModal from './components/PostDetailModal.vue';
import type { CategoryOptionForPhoto, MediaItemType } from '@/types';
import { ref, onMounted, computed } from 'vue';
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
const pageSize = ref(20) // 每页数量
// 移动端检测
const isMobile = () => {
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
// 统一的分类数据
const categoryOptions = ref<CategoryOptionForPhoto[]>([
  { category: 0, title: "全部", text: "all" },
  { category: 1, title: "好看", text: "good" },
  { category: 2, title: "风景", text: "landscape" },
  { category: 3, title: "图片", text: "photo" },
  { category: 4, title: "视频", text: "video" }
])

const showEmptySearch = computed(() => {
  return !isLoading.value && !isError.value && mediaList.value.length === 0 && keyword.value.trim() !== ''
})

// 优化：添加请求缓存和防抖
let requestCache = new Map<string, any>()
const requestCacheTimeout = 5 * 60 * 1000 // 5分钟缓存

// 加载照片数据 - 优化版本
const loadPhotos = async (filterCategory: number = 0) => {
  try {
    isLoading.value = true
    isError.value = false
    
    // 检查缓存
    const cacheKey = `${page.value}-${filterCategory}-${keyword.value}-${type.value}`
    const cachedData = requestCache.get(cacheKey)
    if (cachedData && Date.now() - cachedData.timestamp < requestCacheTimeout) {
      // 使用缓存数据
      const response = cachedData.data
      if (response.code === 0 && response.result) {
        processMediaList(response.result.list, filterCategory)
        total.value = response.result.total
        totalPage.value = response.result.totalPage
      }
      isLoading.value = false
      return
    }

    const response = await getPhotoListAPI(
      page.value,
      filterCategory,
      keyword.value,
      type.value,
      pageSize.value,
      'created_at',
      'desc'
    )
    
    // 缓存响应数据
    requestCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    })
    
    if (response.code === 0 && response.result) {
      processMediaList(response.result.list, filterCategory)
      total.value = response.result.total
      totalPage.value = response.result.totalPage
    } else {
      isError.value = true
    }
  } catch (error) {
    console.error('加载照片失败:', error)
    $notification.error({
      title: '错误',
      content: '加载照片失败，请稍后重试'
    })
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

// 处理媒体列表数据 - 优化版本，添加尺寸预获取
const processMediaList = (list: MediaItemType[], filterCategory: number) => {
  const processedList = list.map((item: MediaItemType) => {
    const processedItem: MediaItemType & { isLiked?: boolean; _aspectRatio?: number; _estimatedHeight?: number } = {
      ...item,
      isLiked: false, // 只保留点赞状态
      // 预计算宽高比，减少组件计算
      _aspectRatio: item.aspectRatio || (item.type === 2 ? 16/9 : 1),
      // 添加预估高度，避免初始闪动
      _estimatedHeight: calculateEstimatedHeight(item)
    }
    
    // 异步预获取图片尺寸
    if (item.type === 1) {
      preloadImageDimensions(item)
    }
    
    return processedItem
  })
  
  mediaList.value = page.value === 1 ? processedList : [...mediaList.value, ...processedList]
}

// 计算预估高度
const calculateEstimatedHeight = (item: MediaItemType): number => {
  const aspectRatio = item.aspectRatio || (item.type === 2 ? 16/9 : 1)
  // 基于常见容器宽度计算预估高度
  const containerWidth = window.innerWidth <= 768 ? 160 : 280
  return Math.min(containerWidth / aspectRatio, 500)
}

// 预获取图片尺寸
const imageDimensionsCache = new Map<number, { width: number; height: number }>()

const preloadImageDimensions = (item: any) => {
  if (item.type !== 1) return
  
  const imageUrl = item.cover || item.imageUrls?.[0]
  if (!imageUrl) return
  
  // 检查缓存
  if (imageDimensionsCache.has(item.id)) {
    return
  }
  
  const img = new Image()
  img.onload = () => {
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      imageDimensionsCache.set(item.id, {
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
  }
  img.src = imageUrl
}
// 切换标签时的处理
const handleTabChange = (key: string | number) => {
  currentCategory.value = Number(key)
  // 重置到第一页
  page.value = 1
  // 根据选中的分类获取对应的数据
  loadPhotos(Number(key))
}

// 处理点赞 - 静态模拟，不调用API
const handleLike = (item: MediaItemType) => {
  console.log('点赞:', item)
  // 静态模拟点赞效果
  const extendedItem = item as MediaItemType & { isLiked?: boolean }
  extendedItem.isLiked = !extendedItem.isLiked
  item.likedCount += extendedItem.isLiked ? 1 : -1
  
  // 显示提示
  $notification.info({
    title: '提示',
    content: '点赞功能开发中，敬请期待'
  })
}

// 处理评论 - 静态提示
const handleComment = (item: MediaItemType) => {
  console.log('评论:', item)
  // 跳转到详情页查看评论
  $notification.info({
    title: '提示',
    content: '请进入详情页查看评论'
  })
}

// 处理分享 - 简化版本
const handleShare = (item: MediaItemType) => {
  console.log('分享:', item)
  $notification.info({
    title: '提示',
    content: '分享功能开发中'
  })
}

const handleSearch = () => {
  page.value = 1
  loadPhotos(currentCategory.value)
}

const clearSearch = () => {
  keyword.value = ''
  page.value = 1
  loadPhotos(currentCategory.value)
}



// 加载更多照片 - 优化版本，避免闪动
const loadMorePhotos = async () => {
  if (page.value >= totalPage.value || isLoading.value) return
  
  try {
    // 先显示骨架屏，避免内容突然消失
    isLoading.value = true
    page.value++
    
    // 更短的延迟，提升用户体验
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const response = await getPhotoListAPI(
      page.value, 
      currentCategory.value, 
      keyword.value, 
      type.value,
      pageSize.value
    )
    
    if (response.code === 0 && response.result) {
      // 去重处理
      const existingIds = new Set(mediaList.value.map(item => item.id))
      const newItems = response.result.list.filter(item => !existingIds.has(item.id))
      
      if (newItems.length > 0) {
        // 使用渐进式添加，避免大规模重排
        const startIndex = mediaList.value.length
        mediaList.value.push(...newItems)
        total.value = response.result.total
        totalPage.value = response.result.totalPage
        
        // 触发预加载
        setTimeout(() => preloadNewImages(startIndex, newItems.length), 100)
      }
    } else {
      // 如果请求失败，回滚页码
      page.value--
      throw new Error(response.message || '加载失败')
    }
  } catch (error) {
    // 回滚页码
    if (page.value > 1) page.value--
    
    $notification.error({
      title: '错误',
      content: error instanceof Error ? error.message : '加载更多照片失败'
    })
  } finally {
    isLoading.value = false
  }
}

// 预加载新添加的图片
const preloadNewImages = (startIndex: number, count: number) => {
  const endIndex = Math.min(startIndex + count, mediaList.value.length)
  
  for (let i = startIndex; i < endIndex; i++) {
    const item = mediaList.value[i]
    if (!item) continue // 跳过空项
    if (item.type === 1) {
      const img = new Image()
      img.src = item.cover || item.imageUrls?.[0] || ''
      img.loading = 'lazy'
    }
  }
}

// 预加载关键资源 - 优化版本
const preloadCriticalResources = () => {
  // 预加载可见区域的图片
  const preloadVisibleImages = () => {
    if (mediaList.value.length === 0) return
    
    // 预加载前几张图片（首屏）
    const preloadCount = isMobile() ? 6 : 12
    const itemsToPreload = mediaList.value.slice(0, preloadCount)
    
    itemsToPreload.forEach(item => {
      if (!item) return // 跳过空项
      if (item.type === 1) {
        const img = new Image()
        img.src = item.cover || item.imageUrls?.[0] || ''
        img.loading = 'eager' // 关键图片立即加载
      }
    })
  }
  
  // 延迟执行，不影响首屏渲染
  setTimeout(preloadVisibleImages, 500)
}

// 组件挂载时加载数据
onMounted(() => {
  // 使用 requestIdleCallback 优化首屏加载
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      loadPhotos()
      preloadCriticalResources()
    })
  } else {
    // 降级方案
    setTimeout(() => {
      loadPhotos()
      preloadCriticalResources()
    }, 0)
  }
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

  .search-container {
    margin-bottom: $padding-24;
    display: flex;
    justify-content: center;

    .search-box {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 500px;
      background: var(--color-bg-2);
      border: 1px solid var(--color-border);
      border-radius: 24px;
      padding: 4px 4px 4px 20px;
      transition: all 0.3s ease;

      &:hover,
      &:focus-within {
        border-color: var(--color-primary);
        box-shadow: 0 2px 8px rgba(var(--color-primary-rgb), 0.1);
      }

      .search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: $font-size-14;
        color: var(--color-text-primary);
        background: transparent;
        padding: 8px 0;

        &::placeholder {
          color: var(--color-text-tertiary);
        }
      }

      .search-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 20px;
        background: var(--color-bg-2);
        color: var(--color-text-primary);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: var(--color-primary);
          transform: scale(1.4);
        }

        &:active {
          transform: scale(0.95);
        }
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

  .empty-search-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    text-align: center;

    .empty-search-icon {
      font-size: 64px;
      margin-bottom: 20px;
      opacity: 0.6;
    }

    .empty-search-text {
      font-size: $font-size-18;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: 8px;
    }

    .empty-search-hint {
      font-size: $font-size-14;
      color: var(--color-text-tertiary);
      margin-bottom: 24px;
    }

    .clear-search-button {
      padding: 10px 28px;
      background: var(--color-bg-2);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border);
      border-radius: 6px;
      font-size: $font-size-14;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background:#f9fbfc ;
        border-color: var(--color-primary);
        .dark-mode & {
          background: #000;
          color: #fff;
        }
      }
    }
  }
}
</style>
