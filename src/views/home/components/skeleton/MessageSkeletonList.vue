<template>
  <div class="message-skeleton-list">
    <MessageCardSkeleton
      v-for="index in count"
      :key="index"
    />
  </div>
</template>

<script setup>
import MessageCardSkeleton from './MessageCardSkeleton.vue'

const props = defineProps({
  count: {
    type: Number,
    default: 12
  }
})
</script>

<style scoped>
.message-skeleton-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
