<template>
  <div v-for="(item, index) in textList" :key="index">
    <FuzzyText
      :text="item as string"
      :font-size="140"
      font-weight="900"
      color="#000"
      :enable-hover="true"
      :base-intensity="0.18"
      :hover-intensity="0.5"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  textList: {
    type: Array,
    default: () => ["404", "页面不存在"],
  },
});
import FuzzyText from "@/components/MotionEffect/FuzzyText.vue";
</script>

<style scoped lang="scss">
div {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>
