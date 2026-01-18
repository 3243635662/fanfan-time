<template>
  <div class="image-card-skeleton-list" :class="listClass">
    <ImageCardSkeleton
      v-for="index in count"
      :key="index"
      :image-height="getImageHeight(index)"
    />
  </div>
</template>

<script setup>
import ImageCardSkeleton from './ImageCardSkeleton.vue'

const props = defineProps({
  count: {
    type: Number,
    default: 8
  },
  imageHeight: {
    type: [String, Array],
    default: 'random'
  },
  listClass: {
    type: String,
    default: 'waterfall-layout'
  }
})

const getImageHeight = (index) => {
  if (Array.isArray(props.imageHeight)) {
    return props.imageHeight[index % props.imageHeight.length]
  }

  if (props.imageHeight === 'random') {
    if (window.innerWidth <= 480) {
      const heights = ['120px', '140px', '160px', '180px', '150px', '170px']
      return heights[index % heights.length]
    } else if (window.innerWidth <= 768) {
      const heights = ['150px', '180px', '210px', '240px', '190px', '220px']
      return heights[index % heights.length]
    } else {
      const heights = ['180px', '220px', '260px', '300px', '240px', '280px']
      return heights[index % heights.length]
    }
  }

  return props.imageHeight
}
</script>

<style scoped>
.image-card-skeleton-list {
  padding: 0;
  margin: 0;
}

.image-card-skeleton-list.waterfall-layout {
  column-count: 2;
  column-gap: 10px;
  list-style: none;
}

.image-card-skeleton-list.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
  list-style: none;
}

.image-card-skeleton-list.waterfall-layout > * {
  break-inside: avoid;
  margin-bottom: 10px;
}

@media (min-width: 960px) {
  .image-card-skeleton-list.waterfall-layout {
    column-count: 4;
    column-gap: 15px;
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .image-card-skeleton-list.waterfall-layout {
    column-count: 3;
    column-gap: 12px;
  }
}
</style>
