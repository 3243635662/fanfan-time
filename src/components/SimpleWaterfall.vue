<!-- src/components/SimpleWaterfall.vue -->
<template>
  <div class="waterfall-container">
    <div class="waterfall-columns" :style="{ gap: columnGap + 'px' }">
      <!-- 遍历每一列 -->
      <div
        v-for="(column, columnIndex) in columns"
        :key="columnIndex"
        class="waterfall-column"
      >
        <!-- 遍历列中的每个卡片 -->
        <div 
          v-for="item in column"
          :key="item.id"
          class="waterfall-item"
          @click="onItemClick(item)"
        >
          <div class="item-image">
            <img :src="item.image" :alt="item.title" />
            <!-- 视频标志 -->
            <div v-if="item.type === 2" class="video-badge">视频</div>
          </div>
          <div class="item-title">{{ item.title }}</div>
          <div class="item-footer">
            <img :src="item.avatar" class="item-avatar" />
            <span class="item-author">{{ item.author }}</span>
            <span class="item-likes">❤️ {{ item.likeCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

// 定义 props
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

// 定义 emit
const emit = defineEmits(['item-click'])

// 响应式状态
const columnCount = ref(2)        // 当前列数
const columnGap = ref(10)         // 列间距
const columns = ref([])           // 每列的内容数组
const columnHeights = ref([])     // 每列的高度

// 根据屏幕宽度计算列数
const updateColumnCount = () => {
  const width = window.innerWidth
  if (width >= 1200) {
    columnCount.value = 4
    columnGap.value = 16
  } else if (width >= 900) {
    columnCount.value = 3
    columnGap.value = 12
  } else {
    columnCount.value = 2
    columnGap.value = 10
  }
}

// 初始化列数组
const initColumns = () => {
  columns.value = Array.from({ length: columnCount.value }, () => []) // 初始化空的一个二维数组，用来存储每列的卡片，一列为又为一个数组[[],[],[],....]
  columnHeights.value = Array.from({ length: columnCount.value }, () => 0) // 初始化每列的高度为0 [0,0,0,...]
}

// 获取最短列的索引（核心算法）
const getShortestColumnIndex = () => {
  let minHeight = Math.min(...columnHeights.value)
  return columnHeights.value.indexOf(minHeight)
}

// 估算卡片高度
const estimateItemHeight = (item) => {
  const baseHeight = 200          // 图片基础高度
  const bottomHeight = 50         // 底部信息高度
  const titleLines = Math.ceil(item.title.length / 20)// 计算标题需要的行数，按照每行20个字符进行行数的高度计算
  const adjustedTitleHeight = Math.min(titleLines * 20, 40) // 调整后的标题高度，最多40px，超过则截断，即最大两行

  let imageHeight = baseHeight
  // 宽高比
  if (item.aspectRatio) {
    const containerWidth = window.innerWidth >= 900 ?
      (window.innerWidth - 60) / 3 :
      (window.innerWidth - 30) / 2
    imageHeight = Math.min(containerWidth / item.aspectRatio, 400)
  }

  return imageHeight + adjustedTitleHeight + bottomHeight
}

// 将项目分配到各列（核心逻辑）
const distributeItems = () => {
  initColumns()
  props.items.forEach(item => {
    const shortestColumnIndex = getShortestColumnIndex() // 获取最短列的索引
    columns.value[shortestColumnIndex].push(item) // 将当前项目添加到最短列的数组中
    const estimatedHeight = estimateItemHeight(item)// 估算当前项目的高度
    columnHeights.value[shortestColumnIndex] += estimatedHeight // 更新最短列的高度
  })
}

// 窗口大小变化处理
const handleResize = () => {
  const oldColumnCount = columnCount.value
  updateColumnCount()
  if (oldColumnCount !== columnCount.value) {
    distributeItems()
  }
}

// 卡片点击事件
const onItemClick = (item) => {
  emit('item-click', item)
}

// 组件挂载
onMounted(() => {
  updateColumnCount()
  distributeItems()
  window.addEventListener('resize', handleResize)
})

// 组件卸载
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 监听 items 变化
watch(() => props.items, () => {
  distributeItems()
}, { deep: true })

</script>

<style scoped lang="scss">
.waterfall-container {
  width: 100%;
  padding: 0 16px;
}

.waterfall-columns {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.waterfall-item {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  .dark-mode & {
    background: #333;
  }
}

.waterfall-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
}

.item-image {
  position: relative;
  width: 100%;
  background: #f0f0f0;
}

.item-image img {
  width: 100%;
  display: block;
  object-fit: cover;
}

.video-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.item-title {
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-footer {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 8px;
}

.item-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.item-author {
  flex: 1;
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-likes {
  font-size: 12px;
  color: #666;
}
</style>
