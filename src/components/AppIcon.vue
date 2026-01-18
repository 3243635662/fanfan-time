<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [String, Number], default: 22 },
  color: { type: String, default: null }, // 支持 #hex / rgb / var() / hsl
});
</script>

<template>
  <div class="app-icon">
  <Icon
    :icon="props.name"
    :width="props.size"
    :height="props.size"
    :style="props.color ? { color: props.color, fill: props.color } : {}"
  />
  </div>
</template>

<style scoped lang="scss">
.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
