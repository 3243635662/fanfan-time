<template>
  <div v-if="imageUrl">
    <a-avatar :imageUrl="imageUrl" :size="size" />
  </div>
  <div v-else>
    <a-avatar :size="size" >
      {{ (username)?.charAt(0) }}
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
