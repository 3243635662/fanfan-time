<template>
  <div v-if="imageUrl && imageUrl.trim()">
    <a-avatar :imageUrl="imageUrl" :size="size" />
  </div>
  <div v-else-if="username">
    <a-avatar :size="size" >
      {{ username?.charAt(0) }}
    </a-avatar>
  </div>
  <div v-else>
    <a-avatar :size="size" imageUrl="https://img0.baidu.com/it/u=4292800137,1650020833&fm=253&fmt=auto?w=800&h=800" >
    </a-avatar>
  </div>
</template>

<script setup lang="ts">
defineProps({
  imageUrl: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 40
  },
  username: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss">

</style>
