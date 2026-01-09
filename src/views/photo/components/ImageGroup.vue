<template>
  <div class="waterfall-container" ref="containerRef">
    <a-image-preview-group infinite>
      <div class="waterfall-columns">
        <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="waterfall-column"
          :style="{ width: columnWidth + 'px' }">
          <a-image v-for="photo in column" :key="photo.id" :src="photo.url" :title="photo.title" width="100%"
            fit="cover" class="waterfall-image" @load="onImageLoad(photo.id, $event)" />
        </div>
      </div>
    </a-image-preview-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Photo {
  id: number
  url: string
  title: string
  description: string
  createdAt: string
  height?: number
}

const props = defineProps({
  photos: {
    type: Array as () => Photo[],
    required: true
  }
})

const containerRef = ref<HTMLElement>()
const columns = ref<Photo[][]>([])
const columnWidth = ref(280)
const columnCount = ref(4)
const loadedImages = ref<Set<number>>(new Set())

// 计算列数
const calculateColumns = () => {
  if (!containerRef.value) return

  const containerWidth = containerRef.value.clientWidth
  const gap = 16

  if (containerWidth >= 1200) {
    columnCount.value = 4
  } else if (containerWidth >= 768) {
    columnCount.value = 3
  } else if (containerWidth >= 480) {
    columnCount.value = 2
  } else {
    columnCount.value = 1
  }

  columnWidth.value = (containerWidth - gap * (columnCount.value - 1)) / columnCount.value
}

// 分配图片到列
const distributePhotos = () => {
  const newColumns: Photo[][] = Array(columnCount.value).fill(null).map(() => [])
  const columnHeights: number[] = Array(columnCount.value).fill(0)

  props.photos.forEach(photo => {
    // 找到高度最小的列
    const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights))
    if (newColumns[minHeightIndex]) {
      newColumns[minHeightIndex].push(photo)
    }

    // 估算图片高度（如果没有加载完成）
    const estimatedHeight = photo.height || (columnWidth.value * (0.6 + Math.random() * 0.8)) // 随机高度模拟真实瀑布流
    if (columnHeights[minHeightIndex] !== undefined) {
      columnHeights[minHeightIndex] += estimatedHeight + 20 // 加上间距
    }
  })

  columns.value = newColumns
}

// 图片加载完成
const onImageLoad = (photoId: number, event: Event) => {
  const img = event.target as HTMLImageElement
  const photo = props.photos.find(p => p.id === photoId)
  if (photo) {
    photo.height = img.naturalHeight * (columnWidth.value / img.naturalWidth)
  }
  loadedImages.value.add(photoId)

  // 重新分配以实现真正的瀑布流
  if (loadedImages.value.size === props.photos.length) {
    distributePhotos()
  }
}

// 处理窗口大小变化
const handleResize = () => {
  calculateColumns()
  distributePhotos()
}

onMounted(() => {
  calculateColumns()
  distributePhotos()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.waterfall-container {
  width: 100%;
  padding: 0 8px;
}

.waterfall-columns {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.waterfall-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.waterfall-image {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
}

// 响应式调整
@media (max-width: 768px) {
  .waterfall-columns {
    gap: 12px;
  }

  .waterfall-column {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .waterfall-columns {
    gap: 8px;
  }

  .waterfall-column {
    gap: 8px;
  }
}
</style>
