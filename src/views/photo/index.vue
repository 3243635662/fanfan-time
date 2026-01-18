<template>
  <div class="photo-page">
    <div class="photo-header">
      <h1>照片墙</h1>
      <p>记录每一个精彩瞬间</p>
    </div>

    <!-- <SketletonList :count="12" list-class="grid-layout" /> -->
    <SimpleWaterfall :items="mockData" @item-click="handleItemClick" />




  </div>
</template>

<script setup lang="ts">
// import SketletonList from '@/components/skeleton/SketletonList.vue';
import SimpleWaterfall from '@/components/SimpleWaterfall.vue';
import { ref } from 'vue';
const mockData = ref([
  {
    id: 1,
    title: '这是一篇很长的标题用来测试多行显示效果',
    image: 'https://picsum.photos/300/400?random=1',
    avatar: 'https://picsum.photos/100/100?random=1',
    author: '用户1',
    likeCount: 123,
    type: 1,
    aspectRatio: 0.75
  },
  {
    id: 2,
    title: '短标题',
    image: 'https://picsum.photos/300/300?random=2',
    avatar: 'https://picsum.photos/100/100?random=2',
    author: '用户2',
    likeCount: 456,
    type: 1,
    aspectRatio: 1
  },
  {
    id: 3,
    title: '中等长度的标题测试',
    image: 'https://picsum.photos/300/500?random=3',
    avatar: 'https://picsum.photos/100/100?random=3',
    author: '用户3',
    likeCount: 789,
    type: 2,
    aspectRatio: 0.6
  },
  {
    id: 4,
    title: '又一篇长标题用来测试瀑布流布局效果',
    image: 'https://picsum.photos/300/350?random=4',
    avatar: 'https://picsum.photos/100/100?random=4',
    author: '用户4',
    likeCount: 321,
    type: 1,
    aspectRatio: 0.85
  },
  {
    id: 5,
    title: '视频内容',
    image: 'https://picsum.photos/300/450?random=5',
    avatar: 'https://picsum.photos/100/100?random=5',
    author: '用户5',
    likeCount: 654,
    type: 2,
    aspectRatio: 0.67
  },
  {
    id: 6,
    title: '测试标题',
    image: 'https://picsum.photos/300/380?random=6',
    avatar: 'https://picsum.photos/100/100?random=6',
    author: '用户6',
    likeCount: 987,
    type: 1,
    aspectRatio: 0.79
  }
])
const handleItemClick = (item:any) => {
  console.log('点击了卡片:', item)
  alert(`点击了: ${item.title}`)
}
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.photo-page {
  min-height: calc(100vh - 20px);
  padding: $padding-24;
  .photo-header {
  text-align: center;
  margin-bottom: $padding-24;

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
}




</style>
