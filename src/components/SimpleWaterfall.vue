<template>
  <div class="waterfall-container">
    <div class="waterfall-columns" :style="{ gap: `${columnGap}px` }">
      <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="waterfall-column">
        <div v-for="item in column" :key="item.id" class="waterfall-item" @mouseenter="onItemHover(item)" @mouseleave="onItemLeave(item)">
          <div class="media-wrapper" :style="getMediaWrapperStyle(item)" @click="onMediaClick(item, $event)">
            <div class="media-box" :style="getMediaBoxStyle(item)">
              <template v-if="item.type === 1">
                <img
                  :ref="(el) => setImageRef(item.id, el as HTMLImageElement | null)"
                  class="media-el"
                  :src="item.cover || item.imageUrls?.[0]"
                  :alt="item.title"
                  loading="lazy"
                  @load="onImageLoad(item)"
                  @error="handleImageError($event)"
                />
              </template>
              <template v-else-if="item.type === 2">
                <div class="video-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>视频</span>
                </div>
                <video
                  :ref="(el) => setVideoRef(item.id, el as HTMLVideoElement | null)"
                  class="media-el"
                  :src="item.videoUrl"
                  loop
                  playsinline
                  webkit-playsinline
                  preload="metadata"
                />
              </template>
            </div>
          </div>
          <div class="item-content" @click="onContentClick(item, $event)">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-footer">
              <FanAvatar :image-url="item.publisher.avatar" :size="24" />
              <span class="item-author">{{ item.publisher.nickname }}</span>
              <div class="item-stats">
                <span class="item-likes">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {{ formatNumber(item.likedCount) }}
                </span>
                <span class="item-comments">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  {{ formatNumber(item.commentCount) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FanAvatar from '@/views/home/components/Fan-Avatar.vue'
import { ref, onMounted, onUnmounted, watch, type PropType } from 'vue'
import type { MediaItemType } from '@/types'

const props = defineProps({
  items: {
    type: Array as PropType<MediaItemType[]>,
    default: () => []
  }
})

const emit = defineEmits(['item-click'])

const columnCount = ref(2)
const columnGap = ref(12)
const columns = ref<MediaItemType[][]>([])
const columnHeights = ref<number[]>([])
const videoRefs = new Map<number, HTMLVideoElement>()
const imageRefs = new Map<number, HTMLImageElement>()
const itemDimensions = new Map<number, { width: number; height: number }>()
const currentPlayingVideoId = ref<number | null>(null)
const hasUserInteracted = ref(false)
const isMobile = ref(false)

const setVideoRef = (id: number, el: Element | null) => {
  if (!el) {
    videoRefs.delete(id)
    return
  }
  const video = el as HTMLVideoElement
  videoRefs.set(id, video)
  
  video.addEventListener('loadedmetadata', () => {
    const dimensions = { width: video.videoWidth, height: video.videoHeight }
    itemDimensions.set(id, dimensions)
    distributeItems()
  })
}

const setImageRef = (id: number, el: Element | null) => {
  if (!el) {
    imageRefs.delete(id)
    return
  }
  imageRefs.set(id, el as HTMLImageElement)
}

const getMediaDimensions = async (item: MediaItemType): Promise<{ width: number; height: number }> => {
  if (itemDimensions.has(item.id)) {
    return itemDimensions.get(item.id)!
  }

  let dimensions: { width: number; height: number }

  if (item.type === 1) {
    const imageUrl = item.cover || item.imageUrls?.[0] || ''
    dimensions = await getImageDimensions(imageUrl)
  } else if (item.type === 2) {
    const video = videoRefs.get(item.id)
    if (video && video.videoWidth > 0 && video.videoHeight > 0) {
      dimensions = { width: video.videoWidth, height: video.videoHeight }
    } else {
      dimensions = await getVideoDimensions(item.videoUrl || '')
    }
  } else {
    dimensions = { width: 1, height: 1 }
  }

  itemDimensions.set(item.id, dimensions)
  return dimensions
}

const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      resolve({ width: 1, height: 1 })
    }
    img.src = url
  })
}

const getVideoDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.src = url
    video.addEventListener('loadedmetadata', () => {
      resolve({ width: video.videoWidth, height: video.videoHeight })
    })
    video.addEventListener('error', () => {
      resolve({ width: 9, height: 16 })
    })
  })
}

const loadAllMediaDimensions = async () => {
  const promises = props.items.map(item => getMediaDimensions(item))
  await Promise.all(promises)
}

const updateColumnCount = () => {
  const width = window.innerWidth
  
  // 检测是否为移动端
  isMobile.value = width <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  if (width >= 1600) {
    columnCount.value = 6
    columnGap.value = 16
  } else if (width >= 1400) {
    columnCount.value = 5
    columnGap.value = 16
  } else if (width >= 1200) {
    columnCount.value = 4
    columnGap.value = 14
  } else if (width >= 900) {
    columnCount.value = 3
    columnGap.value = 12
  } else if (width >= 600) {
    columnCount.value = 2
    columnGap.value = 10
  } else {
    columnCount.value = 2
    columnGap.value = 8
  }
}

const initColumns = () => {
  columns.value = Array.from({ length: columnCount.value }, () => [])
  columnHeights.value = Array.from({ length: columnCount.value }, () => 0)
}

const getShortestColumnIndex = () => {
  let minHeight = Math.min(...columnHeights.value)
  return columnHeights.value.indexOf(minHeight)
}

const getContainerWidth = () => {
  const width = window.innerWidth
  const padding = 12 * 2
  const gap = columnGap.value * (columnCount.value - 1)
  const availableWidth = width - padding - gap
  return Math.max(availableWidth / columnCount.value, 280) // 最小宽度280px
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

const getItemAspectRatio = (item: MediaItemType): number => {
  const dimensions = itemDimensions.get(item.id)
  if (dimensions && dimensions.width > 0 && dimensions.height > 0) {
    return dimensions.width / dimensions.height
  }
  return item.aspectRatio || 1
}

const getMediaBoxStyle = (item: MediaItemType) => {
  const ratio = getItemAspectRatio(item)
  const safeRatio = clamp(ratio, 0.4, 2.5)
  return {
    aspectRatio: `${safeRatio}`,
    paddingBottom: `${100 / safeRatio}%`
  }
}

const getMediaWrapperStyle = (item: MediaItemType) => {
  const ratio = getItemAspectRatio(item)
  const safeRatio = clamp(ratio, 0.4, 2.5)
  const containerWidth = getContainerWidth()
  const mediaHeight = Math.min(containerWidth / safeRatio, 500)
  return {
    maxHeight: `${mediaHeight}px`
  }
}

const estimateItemHeight = (item: MediaItemType) => {
  const contentHeight = 80
  const ratio = getItemAspectRatio(item)
  const safeRatio = clamp(ratio, 0.4, 2.5)
  const containerWidth = getContainerWidth()
  const mediaHeight = Math.min(containerWidth / safeRatio, 500)
  return mediaHeight + contentHeight
}

const distributeItems = async () => {
  await loadAllMediaDimensions()
  initColumns()
  props.items.forEach(item => {
    const shortestColumnIndex = getShortestColumnIndex()
    columns.value[shortestColumnIndex]?.push(item)
    const estimatedHeight = estimateItemHeight(item)
    if (shortestColumnIndex !== -1 && columnHeights.value[shortestColumnIndex] !== undefined) {
      columnHeights.value[shortestColumnIndex] += estimatedHeight
    }
  })
}

const handleResize = () => {
  const oldColumnCount = columnCount.value
  updateColumnCount()
  if (oldColumnCount !== columnCount.value) {
    distributeItems()
  }
}

const onMediaClick = (item: MediaItemType, event: Event) => {
  // 移动端且是视频时，点击媒体区域实现播放/暂停切换
  if (isMobile.value && item.type === 2) {
    event.stopPropagation() // 阻止事件冒泡
    const video = videoRefs.get(item.id)
    if (video) {
      if (currentPlayingVideoId.value === item.id) {
        // 如果当前视频正在播放，则暂停
        video.pause()
        currentPlayingVideoId.value = null
      } else {
        // 如果当前视频未播放，则暂停其他视频并开始播放当前视频
        pauseCurrentVideo()
        video.play().catch(() => {
          // 如果直接播放失败，尝试静音播放
          video.muted = true
          return video.play()
        }).then(() => {
          currentPlayingVideoId.value = item.id
        }).catch(() => {
          console.log('需要用户交互才能播放视频')
        })
      }
    }
  } else if (isMobile.value && item.type === 1) {
    // 移动端图片，点击媒体区域也触发详情事件
    event.stopPropagation()
    emit('item-click', item)
  }
  // PC端不处理，由内容区域点击处理
}

const onContentClick = (item: MediaItemType, event: Event) => {
  // 内容区域点击，所有情况都触发详情事件
  emit('item-click', item)
}

const onItemHover = (item: MediaItemType) => {
  // PC端且是视频时才hover播放
  if (!isMobile.value && item.type === 2) {
    const video = videoRefs.get(item.id)
    if (video && currentPlayingVideoId.value !== item.id) {
      pauseCurrentVideo()
      // 尝试播放，如果失败则静音播放
      video.play().catch(() => {
        // 如果直接播放失败，尝试静音播放
        video.muted = true
        return video.play()
      }).then(() => {
        currentPlayingVideoId.value = item.id
      }).catch(() => {
        // 如果静音播放也失败，记录需要用户交互
        console.log('需要用户交互才能播放视频')
      })
    }
  }
}

const onItemLeave = (item: MediaItemType) => {
  // PC端且是视频时才hover暂停
  if (!isMobile.value && item.type === 2 && currentPlayingVideoId.value === item.id) {
    const video = videoRefs.get(item.id)
    if (video) {
      video.pause()
      video.currentTime = 0
      // 离开时恢复声音设置
      video.muted = false
      currentPlayingVideoId.value = null
    }
  }
}

const pauseCurrentVideo = () => {
  if (currentPlayingVideoId.value !== null) {
    const video = videoRefs.get(currentPlayingVideoId.value)
    if (video) {
      video.pause()
      video.currentTime = 0
      video.muted = false // 恢复声音设置
    }
  }
}

const onImageLoad = (item: MediaItemType) => {
  const img = imageRefs.get(item.id)
  if (img) {
    const dimensions = { width: img.naturalWidth, height: img.naturalHeight }
    itemDimensions.set(item.id, dimensions)
    distributeItems()
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://img1.baidu.com/it/u=3069628509,2117073896&fm=253&fmt=auto&app=138&f=JPEG?w=475&h=665'
}

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

onMounted(() => {
  updateColumnCount()
  distributeItems()
  window.addEventListener('resize', handleResize)
  
  // 监听用户首次交互，解锁音频播放
  const unlockAudio = () => {
    hasUserInteracted.value = true
    document.removeEventListener('click', unlockAudio)
    document.removeEventListener('touchstart', unlockAudio)
    document.removeEventListener('keydown', unlockAudio)
  }
  
  document.addEventListener('click', unlockAudio)
  document.addEventListener('touchstart', unlockAudio)
  document.addEventListener('keydown', unlockAudio)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  pauseCurrentVideo()
})

watch(() => props.items, async () => {
  itemDimensions.clear()
  pauseCurrentVideo()
  currentPlayingVideoId.value = null
  distributeItems()
}, { deep: true })
</script>

<style scoped lang="scss">
.waterfall-container {
  width: 100%;
  padding: 0 12px;
  max-width: 1920px;
  margin: 0 auto;
  box-sizing: border-box;
  overflow: hidden;
}

.waterfall-columns {
  display: flex;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.waterfall-item {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .dark-mode & {
    background: #242424;
    border-color: rgba(255, 255, 255, 0.06);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}

.waterfall-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.08);

  .dark-mode & {
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

.media-wrapper {
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, #f8f9fa 0%, #f3f4f6 100%);
  overflow: hidden;

  .dark-mode & {
    background: linear-gradient(135deg, #1e1e2e 0%, #2d2d3d 100%);
  }
}

.media-box {
  position: relative;
  width: 100%;
  background: transparent;
  overflow: hidden;
}

.media-el {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.waterfall-item:hover .media-el {
  transform: scale(1.03);
}

.video-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.85) 100%);
  color: #ffffff;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.waterfall-item:hover .video-badge {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.95) 100%);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  transform: scale(1.05);
}

.item-content {
  padding: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);

  .dark-mode & {
    background: linear-gradient(180deg, #242424 0%, #1e1e2e 100%);
  }
}

.item-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.6;
  color: #1a1a1a;
  margin-bottom: 12px;
  display: -webkit-box;
  display: -moz-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  letter-spacing: 0.3px;

  .dark-mode & {
    color: #f5f5f5;
  }
}

.item-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 4px;
}

.item-author {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #4a5568;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .dark-mode & {
    color: #9ca3af;
  }
}

.item-stats {
  display: flex;
  align-items: center;
  gap: 14px;
}

.item-likes,
.item-comments {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.25s ease;

  .dark-mode & {
    color: #9ca3af;
  }
}

.item-likes:hover {
  color: #ef4444;
  transform: scale(1.05);
}

.item-comments:hover {
  color: #6366f1;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .waterfall-container {
    padding: 0 10px;
  }

  .waterfall-item {
    border-radius: 14px;
  }

  .item-content {
    padding: 12px;
  }

  .item-title {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .video-badge {
    top: 10px;
    right: 10px;
    padding: 6px 12px;
    font-size: 11px;
  }

  .item-footer {
    gap: 8px;
  }

  .item-stats {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .waterfall-container {
    padding: 0 6px;
  }

  .waterfall-item {
    border-radius: 12px;
  }

  .item-content {
    padding: 10px;
  }

  .item-title {
    font-size: 13px;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    margin-bottom: 8px;
  }

  .item-author {
    font-size: 12px;
  }

  .item-likes,
  .item-comments {
    font-size: 12px;
  }

  .video-badge {
    top: 8px;
    right: 8px;
    padding: 5px 10px;
    font-size: 10px;
  }
}
</style>
