<template>
  <div class="social-waterfall-root">
    <div class="social-waterfall" ref="containerRef">
    <!-- 骨架屏 -->
    <div v-if="showSkeleton" class="skeleton-container">
      <div 
        v-for="(item, index) in skeletonItems" 
        :key="index"
        class="skeleton-item"
        :style="{ height: item.height + 'px' }"
      >
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-footer">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-name"></div>
            <div class="skeleton-stats">
              <div class="skeleton-stat"></div>
              <div class="skeleton-stat"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 真实内容 -->
    <div v-else class="waterfall-columns" :style="{ gap: `${columnGap}px` }">
      <div
        v-for="(column, columnIndex) in columns"
        :key="columnIndex"
        class="waterfall-column"
      >
        <div
          v-for="item in column"
          :key="item.id"
          class="waterfall-item"
          @click="handleItemClick(item)"
          :ref="(el) => setItemRef(item.id, el as HTMLElement | null)"
        >
          <!-- 媒体容器 -->
          <div class="media-container">
            <!-- 图片 -->
            <div v-if="item.type === 1" class="image-wrapper">
              <img
                class="media-el"
                :src="item.cover || item.imageUrls?.[0]"
                :alt="item.title"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                @load="onImageLoad(item)"
                @error="handleImageError"
              />
              <!-- 图片加载中的占位 -->
              <div v-if="item && !isImageLoaded(item.id)" class="loading-placeholder">
                <div class="loading-spinner"></div>
              </div>
            </div>

            <!-- 视频 -->
            <div v-else-if="item.type === 2" class="video-wrapper" @click.stop="toggleVideo(item.id)">
              <video
                :ref="(el) => setVideoRef(item.id, el as HTMLVideoElement | null)"
                class="media-el"
                :src="item.videoUrl"
                loop
                playsinline
                preload="metadata"
                @loadeddata="onVideoLoad(item)"
                @loadedmetadata="onVideoMetadataLoad(item)"
                @canplay="onVideoCanPlay(item)"
                @canplaythrough="onVideoCanPlayThrough(item)"
                @error="onVideoError(item)"
              />
              <!-- 视频封面 -->
              <div class="video-cover">
                <div class="video-play-icon" :class="{ 'playing': playingVideoId === item.id }">
                  <svg v-if="playingVideoId !== item.id" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                </div>
              </div>
              <!-- 视频加载中的占位 -->
              <div v-if="!isVideoActuallyReady(item.id)" class="loading-placeholder">
                <div class="loading-spinner"></div>
              </div>
            </div>

            <!-- 互动按钮（悬浮）- 只在PC端显示 -->
            <div class="interaction-buttons" v-if="!isMobile">
              <div class="like-btn" @click.stop="handleLike(item)">
                <svg viewBox="0 0 24 24" :fill="(item as ExtendedMediaItemType).isLiked ? 'currentColor' : 'none'" stroke="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span>{{ formatNumber(item.likedCount) }}</span>
              </div>
              <div class="comment-btn" @click.stop="handleComment(item)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <span>{{ formatNumber(item.commentCount) }}</span>
              </div>
              <div class="share-btn" @click.stop="handleShare(item)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                  <span>{{ formatNumber(item.sharedCount) }}</span>
              </div>
            </div>
          </div>

          <!-- 内容信息 -->
          <div class="item-info">
            <div class="item-user">
              <FanAvatar :image-url="item.publisher.avatar" :size="isMobile ? 24 : 28" />
              <span class="item-author">{{ item.publisher.username }}</span>
            </div>
            <div class="item-content-row">
              <div class="item-title">{{ item.title }}</div>
              <div class="time">{{ formatDate(item.publishTime) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部加载更多 -->
    <div v-if="loading && !showSkeleton" class="bottom-loading">
      <div class="loading-spinner"></div>
      <span>正在加载更多内容...</span>
    </div>

    <!-- 没有更多内容 -->
    <div v-if="noMore && !showSkeleton" class="no-more">
      <div class="no-more-line"></div>
      <span>没有更多内容了</span>
      <div class="no-more-line"></div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { MediaItemType } from '@/types'
import FanAvatar from '@/views/home/components/Fan-Avatar.vue'
import { formatDate } from '@/utils'
import { useSettingStore } from '@/store/setting'
import { viewMediaAPI } from '@/api/photo'
const settingStore = useSettingStore()
interface Props {
  items: MediaItemType[]
  loading?: boolean
  noMore?: boolean
}

// 扩展类型，包含我们添加的额外属性
interface ExtendedMediaItemType extends MediaItemType {
  isLiked?: boolean
  _aspectRatio?: number
  _estimatedHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  noMore: false
})

const emit = defineEmits<{
  itemClick: [item: MediaItemType]
  loadMore: []
  like: [item: MediaItemType]
  comment: [item: MediaItemType]
  share: [item: MediaItemType]
}>()

// 响应式状态
const containerRef = ref<HTMLElement>()
const columns = ref<MediaItemType[][]>([])
const columnHeights = ref<number[]>([])
const loadedImages = ref<Set<number>>(new Set())
const loadedVideos = ref<Set<number>>(new Set())
const videoRefs = ref<Map<number, HTMLVideoElement>>(new Map())
const playingVideoId = ref<number | null>(null)
const itemHeights = ref<Map<number, number>>(new Map())
const showSkeleton = ref(true)

// 设备检测
const isMobile = computed(() => {
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
})

// 骨架屏项目 - 随机高度模拟真实瀑布流
const skeletonItems = computed(() => {
  const count = isMobile.value ? 8 : 12
  const items = []
  const heights = isMobile.value
    ? [280, 320, 360, 400, 340, 380] // 移动端高度
    : [320, 380, 420, 480, 360, 440] // PC端高度
  
  for (let i = 0; i < count; i++) {
    const heightIndex = i % (heights?.length || 1)
    items.push({
      height: (heights?.[heightIndex] || 300) + Math.random() * 60 - 30, // 添加随机变化
      id: i
    })
  }
  return items
})

// 移动端优化：强制两列
const columnCount = computed(() => {
  if (isMobile.value) return 2 // 移动端强制两列
  
  const width = containerRef.value?.getBoundingClientRect().width || window.innerWidth
  if (width >= 1600) return 6
  if (width >= 1400) return 5
  if (width >= 1200) return 4
  if (width >= 900) return 3
  return 2
})

const columnGap = computed(() => {
  if (isMobile.value) return 8 // 移动端小间距
  
  const width = containerRef.value?.getBoundingClientRect().width || window.innerWidth
  if (width >= 1600) return 16
  if (width >= 1200) return 14
  if (width >= 900) return 12
  return 10
})

// 获取项目宽高比
const getItemAspectRatio = (item: MediaItemType): number => {
  if (item.aspectRatio) {
    const aspectRatioStr = String(item.aspectRatio)
    if (aspectRatioStr.includes('/')) {
      const [w, h] = aspectRatioStr.split('/').map(Number)
      if (w && h) return w / h
    } else {
      const ratio = Number(aspectRatioStr)
      if (!isNaN(ratio) && ratio > 0) return ratio
    }
  }
  
  if (item.type === 2) return 16/9 // 视频默认16:9
  
  // 根据标题特征判断
  if (item.title?.includes('竖版') || item.title?.includes('头像')) return 3/4
  if (item.title?.includes('横版') || item.title?.includes('壁纸')) return 16/9
  
  return 1 // 默认方形
}

// 计算项目高度（修复闪动问题）
const calculateItemHeight = (item: MediaItemType): number => {
  if (!item) return 300 // 默认高度，如果item为undefined
  
  // 内容区域高度
  const userHeight = isMobile.value ? 34 : 40 // 用户信息行高度
  const titleHeight = item.title ? Math.ceil(item.title.length / 20) * (isMobile.value ? 16 : 18) + 8 : 0 // 标题高度（根据字数计算）
  const contentHeight = userHeight + Math.min(titleHeight, isMobile.value ? 36 : 40) + (isMobile.value ? 14 : 16) // 总内容高度
  
  // 媒体高度 - 优先使用已计算的高度，避免重复计算
  let mediaHeight = itemHeights.value.get(item.id)
  if (mediaHeight) {
    return mediaHeight + contentHeight
  }
  
  // 使用预估高度（从父组件传入）或预设比例计算
  const extendedItem = item as ExtendedMediaItemType
  if (extendedItem._estimatedHeight) {
    mediaHeight = extendedItem._estimatedHeight
  } else {
    // 使用预设比例计算（移除随机因子，避免高度跳动）
    const aspectRatio = getItemAspectRatio(item)
    const containerWidth = getContainerWidth()
    
    // 基于item.id生成稳定的伪随机因子，确保同一项目高度始终一致
    const stableRandomFactor = 0.9 + (item.id % 10) * 0.02 // 0.9-1.1的稳定因子
    mediaHeight = Math.min(containerWidth / aspectRatio, isMobile.value ? 350 : 500) * stableRandomFactor
  }
  
  // 缓存计算结果，避免重复计算
  if (mediaHeight) {
    itemHeights.value.set(item.id, mediaHeight)
  }
  
  return (mediaHeight || 0) + contentHeight
}

// 获取容器宽度
const getContainerWidth = (): number => {
  const container = containerRef.value
  if (!container) return isMobile.value ? 160 : 280 // 移动端最小宽度
  
  const containerWidth = container.getBoundingClientRect().width
  const gap = columnGap.value
  const count = columnCount.value
  
  return Math.max((containerWidth - (count - 1) * gap) / count, isMobile.value ? 160 : 200)
}

// 分发项目到列 - 真正的瀑布流算法
const distributeItems = async () => {
  await nextTick()
  
  // 初始化列
  const count = columnCount.value
  columns.value = Array.from({ length: count }, () => [])
  columnHeights.value = Array.from({ length: count }, () => 0)
  
  // 按实际高度分发到最短列
  props.items.forEach(item => {
    if (!item) return // 跳过空项
    const shortestColumnIndex = getShortestColumnIndex()
    const itemHeight = calculateItemHeight(item)
    
    // 确保数组已初始化
    if (!columns.value[shortestColumnIndex]) {
      columns.value[shortestColumnIndex] = []
    }
    if (!columnHeights.value[shortestColumnIndex]) {
      columnHeights.value[shortestColumnIndex] = 0
    }
    
    columns.value[shortestColumnIndex].push(item)
    columnHeights.value[shortestColumnIndex] += itemHeight
  })
}

// 获取最短列
const getShortestColumnIndex = (): number => {
  if (!columnHeights.value || columnHeights.value.length === 0) return 0
  
  let minIndex = 0
  let minHeight = columnHeights.value[0] || 0
  
  for (let i = 1; i < columnHeights.value.length; i++) {
    const currentHeight = columnHeights.value[i] || 0
    if (currentHeight < minHeight) {
      minHeight = currentHeight
      minIndex = i
    }
  }
  
  return minIndex
}

// 检查图片是否加载完成
const isImageLoaded = (id: number): boolean => {
  return loadedImages.value.has(id)
}

// 检查视频是否加载完成
const isVideoLoaded = (id: number): boolean => {
  return loadedVideos.value.has(id)
}

// 检查视频是否真正准备就绪（更智能的判断）
const isVideoActuallyReady = (id: number): boolean => {
  // 如果已经标记为加载完成，直接返回true
  if (loadedVideos.value.has(id)) return true
  
  const video = videoRefs.value.get(id)
  if (!video) return false
  
  // 多重检查确保视频真正可用
  const isReady = (
    video.readyState >= 2 || // HAVE_CURRENT_DATA 或更高
    (video.src && video.duration > 0) || // 有源且有时长
    (video.videoWidth > 0 && video.videoHeight > 0) || // 有视频尺寸
    (video.currentTime > 0) // 已经播放过
  )
  
  if (isReady) {
    // 如果检测到已就绪，更新状态
    loadedVideos.value.add(id)
  }
  
  return isReady
}

// 设置视频引用
const setVideoRef = (id: number, el: HTMLVideoElement | null) => {
  if (el) {
    videoRefs.value.set(id, el)
  } else {
    videoRefs.value.delete(id)
  }
}

// 暂停所有视频
const pauseAllVideos = () => {
  videoRefs.value.forEach((video) => {
    if (video) {
      video.pause()
    }
  })
  playingVideoId.value = null
}

// 切换视频播放状态 - 优化版本
const toggleVideo = async (id: number) => {
  const video = videoRefs.value.get(id)
  if (!video) return
  
  if (playingVideoId.value === id) {
    video.pause()
    playingVideoId.value = null
  } else {
    // 暂停其他视频
    if (playingVideoId.value) {
      const currentVideo = videoRefs.value.get(playingVideoId.value)
      if (currentVideo) {
        currentVideo.pause()
      }
    }
    
    // 首次播放时设置src（延迟加载）
    if (!video.src) {
      const item = props.items.find(item => item.id === id)
      if (item?.videoUrl) {
        video.src = item.videoUrl
        video.load()
        
        // 立即检查视频是否已经可以播放
        if (video.readyState >= 2) {
          loadedVideos.value.add(id)
        } else {
          // 等待视频准备就绪
          await new Promise<void>((resolve) => {
            const onReady = () => {
              loadedVideos.value.add(id)
              resolve()
            }
            
            // 监听多个可能的事件
            video.addEventListener('loadedmetadata', onReady, { once: true })
            video.addEventListener('canplay', onReady, { once: true })
            video.addEventListener('loadeddata', onReady, { once: true })
            
            // 超时保护，避免无限等待
            setTimeout(() => {
              loadedVideos.value.add(id)
              resolve()
            }, 2000)
          })
        }
      }
    }
    
    try {
      // 尝试播放有声视频
      await video.play()
      playingVideoId.value = id
    } catch (error) {
      // 如果播放失败，尝试静音播放
      console.log('有声播放失败，尝试静音播放:', error)
      video.muted = true
      try {
        await video.play()
        playingVideoId.value = id
        // 显示提示让用户手动开启声音
        showUnmuteTip()
      } catch (mutedError) {
        console.log('静音播放也失败:', mutedError)
      }
    }
  }
}

// 显示解除静音提示
const showUnmuteTip = () => {

  console.log('视频正在静音播放，点击扬声器图标开启声音')
}

// 检查视频就绪状态（初始化时调用）
const checkVideoReadiness = () => {
  // 检查所有视频元素的就绪状态
  videoRefs.value.forEach((video, id) => {
    if (video && !loadedVideos.value.has(id)) {
      if (video.readyState >= 2 || (video.src && video.duration > 0)) {
        loadedVideos.value.add(id)
      }
    }
  })
}

// 处理图片加载错误

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // 可以设置默认图片或者进行其他错误处理
  console.log('图片加载失败:', img.src)
}

// 图片加载完成 - 修复闪动问题
const onImageLoad = (item: MediaItemType) => {
  loadedImages.value.add(item.id)
  
  // 获取实际图片尺寸并更新缓存
  const img = (event as Event)?.target as HTMLImageElement
  if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
    const aspectRatio = img.naturalWidth / img.naturalHeight
    const containerWidth = getContainerWidth()
    const actualHeight = containerWidth / aspectRatio
    
    // 只有在高度差异较大时才更新布局（避免微小差异导致的闪动）
    const currentHeight = itemHeights.value.get(item.id)
    const heightDiff = Math.abs(actualHeight - (currentHeight || 0))
    const threshold = 50 // 高度差异阈值，超过这个值才重新布局
    
    if (!currentHeight || heightDiff > threshold) {
      itemHeights.value.set(item.id, actualHeight)
      // 使用防抖，避免频繁重新布局
      debouncedRedistribute()
    }
    
    // 预加载相邻图片
    preloadAdjacentImages(item)
  }
}

// 预加载相邻图片
const preloadAdjacentImages = (currentItem: MediaItemType) => {
  const allItems = props.items
  const currentIndex = allItems.findIndex(item => item.id === currentItem.id)
  
  if (currentIndex === -1) return
  
  // 预加载前后各2张图片
  const preloadRange = 2
  const startIndex = Math.max(0, currentIndex - preloadRange)
  const endIndex = Math.min(allItems.length - 1, currentIndex + preloadRange)
  
  for (let i = startIndex; i <= endIndex; i++) {
    if (i !== currentIndex) {
      const item = allItems[i]
      if (item && item.type === 1 && !loadedImages.value.has(item.id)) {
        const img = new Image()
        img.src = item.cover || item.imageUrls?.[0] || ''
        img.loading = 'lazy'
      }
    }
  }
}

// 视频加载完成
const onVideoLoad = (item: MediaItemType) => {
  loadedVideos.value.add(item.id)
  
  const video = videoRefs.value.get(item.id)
  if (video && video.videoWidth > 0 && video.videoHeight > 0) {
    const aspectRatio = video.videoWidth / video.videoHeight
    const containerWidth = getContainerWidth()
    const actualHeight = containerWidth / aspectRatio
    
    itemHeights.value.set(item.id, actualHeight)
    distributeItems()
  }
}

// 视频元数据加载完成
const onVideoMetadataLoad = (item: MediaItemType) => {
  loadedVideos.value.add(item.id)
}

// 视频可以播放
const onVideoCanPlay = (item: MediaItemType) => {
  loadedVideos.value.add(item.id)
}

// 视频可以流畅播放
const onVideoCanPlayThrough = (item: MediaItemType) => {
  loadedVideos.value.add(item.id)
}

// 视频加载错误
const onVideoError = (item: MediaItemType) => {
  console.error('Video load error:', item.id)
  // 错误时也要标记为已加载，避免无限loading
  loadedVideos.value.add(item.id)
}

// 处理各种交互
const handleItemClick = (item: MediaItemType) => {
  useSettingStore().openMediaDetailModal(item.id)
  // 增加查看数
  viewMediaAPI({ mediaId: item.id })
}

const handleLike = (item: MediaItemType) => {
  emit('like', item)
}

const handleComment = (item: MediaItemType) => {
  emit('comment', item)
}

const handleShare = (item: MediaItemType) => {
  emit('share', item)
}

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 滚动加载更多 - 优化检测，添加虚拟滚动
const handleScroll = () => {
  if (props.loading || props.noMore || showSkeleton.value) return
  
  const container = containerRef.value
  if (!container) return
  
  const windowHeight = window.innerHeight
  const containerBottom = container.getBoundingClientRect().bottom
  
  // 距离底部300px时触发加载（移动端优化）
  const triggerDistance = isMobile.value ? 300 : 200
  if (containerBottom - triggerDistance <= windowHeight) {
    emit('loadMore')
  }
  
  // 虚拟滚动：只渲染可见区域的内容
  updateVisibleItems()
}

// 可见项目跟踪
const visibleItems = ref<Set<number>>(new Set())
const itemRefs = ref<Map<number, HTMLElement>>(new Map())

// 更新可见项目
const updateVisibleItems = () => {
  if (!containerRef.value) return
  
  const windowHeight = window.innerHeight
  const buffer = 200 // 缓冲区，提前加载
  
  // 检查每个项目是否在可见区域
  itemRefs.value.forEach((element, id) => {
    const rect = element.getBoundingClientRect()
    const isVisible = rect.top <= windowHeight + buffer && rect.bottom >= -buffer
    
    if (isVisible && !visibleItems.value.has(id)) {
      visibleItems.value.add(id)
    } else if (!isVisible && visibleItems.value.has(id)) {
      visibleItems.value.delete(id)
    }
  })
}

// 设置项目引用
const setItemRef = (id: number, element: HTMLElement | null) => {
  if (element) {
    itemRefs.value.set(id, element)
  } else {
    itemRefs.value.delete(id)
  }
}

// 防抖函数
const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): T => {
  let timeout: ReturnType<typeof setTimeout>
  return ((...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }) as T
}

// 防抖的重新布局函数
const debouncedRedistribute = debounce(() => {
  distributeItems()
}, 100) // 100ms防抖，避免频繁重排

// 监听数据变化
watch([() => props.items, columnCount], () => {
  // 优化：延迟隐藏骨架屏，避免闪动
  if (props.items.length > 0) {
    setTimeout(() => {
      showSkeleton.value = false
    }, 300) // 300ms延迟，让内容先渲染完成
  }
  distributeItems()
}, { deep: true })

// 监听弹窗状态，打开时暂停所有视频
watch(() => settingStore.isShowModal, (isOpen) => {
  if (isOpen) {
    pauseAllVideos()
  }
})

onMounted(() => {
  // 优化：更智能的骨架屏隐藏策略
  if (props.items.length > 0) {
    // 如果有数据，快速显示内容
    setTimeout(() => {
      showSkeleton.value = false
    }, 200)
  } else {
    // 如果没有数据，延迟显示骨架屏
    setTimeout(() => {
      if (props.items.length === 0) {
        showSkeleton.value = false
      }
    }, 1500)
  }
  
  distributeItems()
  
  // 初始化视频状态检查
  setTimeout(() => {
    checkVideoReadiness()
  }, 500)
  
  window.addEventListener('scroll', debounce(handleScroll, 150)) // 移动端更快的响应
  window.addEventListener('resize', debounce(distributeItems, 300))
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', distributeItems)
})

// 暴露方法给父组件
defineExpose({
  pauseAllVideos
})
</script>

<style scoped lang="scss">
.social-waterfall-root {
  width: 100%;
}

.social-waterfall {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  min-height: 100vh;
}

// 骨架屏样式
.skeleton-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
}

.skeleton-item {
  flex: 1;
  min-width: calc(50% - 4px); // 两列布局
  max-width: calc(50% - 4px);
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;

  .dark-mode & {
    background: #2a2a2a;
  }
}

.skeleton-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;

  .dark-mode & {
    background: linear-gradient(90deg, #3a3a3a 25%, #4a4a4a 50%, #3a3a3a 75%);
  }
}

.skeleton-content {
  padding: 12px;
}

.skeleton-title {
  height: 16px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 12px;
  animation: skeleton-loading 1.5s infinite;

  .dark-mode & {
    background: #4a4a4a;
  }
}

.skeleton-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skeleton-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e0e0e0;
  animation: skeleton-loading 1.5s infinite;

  .dark-mode & {
    background: #4a4a4a;
  }
}

.skeleton-name {
  flex: 1;
  height: 12px;
  background: #e0e0e0;
  border-radius: 4px;
  animation: skeleton-loading 1.5s infinite;

  .dark-mode & {
    background: #4a4a4a;
  }
}

.skeleton-stats {
  display: flex;
  gap: 8px;
}

.skeleton-stat {
  width: 20px;
  height: 12px;
  background: #e0e0e0;
  border-radius: 4px;
  animation: skeleton-loading 1.5s infinite;

  .dark-mode & {
    background: #4a4a4a;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

// 瀑布流布局
.waterfall-columns {
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.waterfall-item {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;

  .dark-mode & {
    background: #1a1a1a;
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

    .dark-mode & {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }
  }
}

// 媒体容器
.media-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.image-wrapper,
.video-wrapper {
  position: relative;
  width: 100%;
  background: #f8f9fa;
  overflow: hidden;

  .dark-mode & {
    background: #2a2a2a;
  }
}

.media-el {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.waterfall-item:hover .media-el {
  transform: scale(1.05);
}

// 加载占位
.loading-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);

  .dark-mode & {
    background: rgba(0, 0, 0, 0.2);
  }
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ff2442;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 视频特殊处理
.video-wrapper {
  position: relative;
  padding-bottom: 177.78%; // 16:9 比例
  background: #000;
}

.video-wrapper .media-el {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-cover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.video-play-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff2442;
  font-size: 18px;
  transition: all 0.3s ease;
  cursor: pointer;
  pointer-events: all;

  &:hover {
    transform: scale(1.1);
    background: white;
  }

  &.playing {
    opacity: 0;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

// 互动按钮（悬浮效果）- 修复遮挡问题
.interaction-buttons {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10; /* 确保在最上层 */
}

.waterfall-item:hover .interaction-buttons {
  opacity: 1;
}

.like-btn,
.comment-btn,
.share-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    transform: scale(1.1);
    background: white;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #333;
  }

  span {
    font-size: 10px;
    font-weight: 600;
    color: #666;
  }
}

.like-btn {
  svg {
    color: #ff2442;
  }
}

// 内容信息
.item-info {
  padding: 10px 12px;
}

.item-user {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.item-author {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .dark-mode & {
    color: #fff;
  }
}

.item-content-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.item-title {
  flex: 1;
  font-size: 13px;
  line-height: 1.4;
  color: var(--color-text-primary);
  margin-bottom: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;

  .dark-mode & {
    color: #fff;
  }
}

.time {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--color-text-tertiary);
  white-space: nowrap;
  line-height: 1.4;
  padding-top: 2px;

  .dark-mode & {
    color: #999;
  }
}

// 底部加载
.bottom-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 12px;
  color: #999;
  font-size: 14px;

  .dark-mode & {
    color: #666;
  }
}

.no-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 12px;
  color: #999;
  font-size: 14px;

  .dark-mode & {
    color: #666;
  }
}

.no-more-line {
  flex: 1;
  height: 1px;
  background: #e0e0e0;

  .dark-mode & {
    background: #333;
  }
}

// 移动端优化
@media (max-width: 768px) {
  .waterfall-columns {
    padding: 6px;
    gap: 6px;
  }

  .waterfall-column {
    gap: 6px;
  }

  .waterfall-item {
    border-radius: 8px;
    margin-bottom: 0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }

  .item-info {
    padding: 8px 10px;
  }

  .item-user {
    margin-bottom: 4px;
    gap: 5px;
  }

  .item-author {
    font-size: 11px;
  }

  .item-content-row {
    gap: 6px;
  }

  .item-title {
    font-size: 12px;
    line-height: 1.3;
    -webkit-line-clamp: 2;
  }

  .time {
    font-size: 10px;
    line-height: 1.3;
    padding-top: 1px;
  }

  .interaction-buttons {
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    gap: 6px;
    opacity: 1;
  }

  .like-btn,
  .comment-btn,
  .share-btn {
    width: 32px;
    height: 32px;

    svg {
      width: 14px;
      height: 14px;
    }

    span {
      font-size: 8px;
    }
  }

  .video-play-icon {
    width: 36px;
    height: 36px;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  .skeleton-container {
    gap: 6px;
    padding: 6px;
  }

  .skeleton-item {
    min-width: calc(50% - 3px);
    max-width: calc(50% - 3px);
    margin-bottom: 0;
  }
}

// 超小屏幕优化
@media (max-width: 480px) {
  .waterfall-columns {
    padding: 4px;
    gap: 4px;
  }

  .waterfall-column {
    gap: 4px;
  }

  .waterfall-item {
    border-radius: 6px;
  }

  .item-info {
    padding: 6px 8px;
  }

  .item-user {
    margin-bottom: 3px;
    gap: 4px;
  }

  .item-author {
    font-size: 10px;
  }

  .item-content-row {
    gap: 4px;
  }

  .item-title {
    font-size: 11px;
    line-height: 1.2;
  }

  .time {
    font-size: 9px;
  }

  .interaction-buttons {
    right: 4px;
    gap: 4px;
    opacity: 1;
  }

  .like-btn,
  .comment-btn,
  .share-btn {
    width: 28px;
    height: 28px;

    svg {
      width: 12px;
      height: 12px;
    }

    span {
      font-size: 7px;
    }
  }

  .video-play-icon {
    width: 32px;
    height: 32px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
}

// 暗色模式优化
@media (prefers-color-scheme: dark) {
  .waterfall-item {
    background: #1a1a1a;
  }

  .loading-placeholder {
    background: rgba(0, 0, 0, 0.3);
  }

  .video-cover {
    background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 100%);
  }

  .interaction-buttons {
    .like-btn,
    .comment-btn,
    .share-btn {
      background: rgba(30, 30, 30, 0.9);
      border-color: rgba(255, 255, 255, 0.1);

      svg {
        color: #fff;
      }

      span {
        color: #ccc;
      }

      &:hover {
        background: #2a2a2a;
      }
    }
  }
}
</style>

