<template>
  <a-modal
    v-model:visible="showModal"
    title="人机验证"
    :footer="false"
    width="400px"
    @ok="handleModalOk"
    @cancel="handleModalCancel"
  >
    <div class="turnstile-modal-content">
      <div ref="turnstileContainer" class="turnstile-container"></div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, nextTick } from 'vue';
import { $notification } from '@/hooks/useNotification';

// 声明 全局的 window.turnstile 类型
declare global {
  interface Window {
    turnstile?: {
      ready: (callback: () => void) => void;
      render: (
        container: string | HTMLElement,
        options: TurnstileOptions,
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      execute: (widgetId?: string) => void;
      getResponse: (widgetId: string) => string;
    };
  }
}

interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: (code: string) => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  execution?: 'render' | 'execute';
  appearance?: 'always' | 'execute' | 'interaction-only';
}

// 组件 Props
const props = defineProps<{
  sitekey: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  execution?: 'render' | 'execute';
  appearance?: 'always' | 'execute' | 'interaction-only';
}>();

// 组件事件
const emit = defineEmits<{
  (e: 'success', token: string): void;
  (e: 'error', code: string): void;
  (e: 'expired'): void;
  (e: 'loaded'): void;
}>();

const showModal = ref(false);
const turnstileContainer = ref<HTMLElement | null>(null);
let widgetId: string | null = null;

// 显示模态框
const show = () => {
  showModal.value = true;
  // 等待 DOM 更新后再初始化 Turnstile
  nextTick(() => {
    initTurnstile();
  });
};

// 隐藏模态框
const hide = () => {
  showModal.value = false;
};

// 初始化并渲染 Turnstile
const initTurnstile = () => {
  if (!turnstileContainer.value) {
    console.error('Turnstile 容器未找到');
    return;
  }

  // 如果已经渲染过，先移除
  if (widgetId && window.turnstile) {
    window.turnstile.remove(widgetId);
    widgetId = null;
  }

  // 确保 SDK 已加载
  if (!window.turnstile) {
    console.error('Turnstile SDK 未加载');
    emit('error', 'SDK_NOT_LOADED');
    return;
  }

  const options: TurnstileOptions = {
    sitekey: props.sitekey,
    theme: props.theme || 'auto',
    size: props.size || 'normal',
    execution: props.execution || 'render',
    appearance: props.appearance || 'always',
    callback: (token: string) => {
      emit('success', token);
    },
    'error-callback': (code: string) => {
      emit('error', code);
    },
    'expired-callback': () => {
      emit('expired');
    },
  };

  try {
    // 渲染 Turnstile
    widgetId = window.turnstile.render(turnstileContainer.value, options);
    emit('loaded');
    
    // 如果是 execute 模式，自动触发验证
    if (props.execution === 'execute') {
      window.turnstile.execute(widgetId);
    }
  } catch (error) {
    console.error('Turnstile 渲染失败:', error);
    emit('error', 'RENDER_FAILED');
  }
};

// 重置验证码
const reset = () => {
  if (widgetId && window.turnstile) {
    window.turnstile.reset(widgetId);
  }
};

// 手动触发验证（用于 execute 模式）
const execute = () => {
  if (widgetId && window.turnstile) {
    window.turnstile.execute(widgetId);
  } else {
    // 如果还没渲染，先渲染再执行
    initTurnstile();
  }
};

// 获取当前 token
const getResponse = () => {
  if (widgetId && window.turnstile) {
    return window.turnstile.getResponse(widgetId);
  }
  return null;
};

// 暴露方法给父组件
defineExpose({
  show,
  hide,
  reset,
  execute,
  getResponse,
});

// 监听 props 变化，重新渲染
watch(
  () => [props.theme, props.size, props.execution, props.appearance],
  () => {
    initTurnstile();
  },
);



onUnmounted(() => {
  if (widgetId && window.turnstile) {
    window.turnstile.remove(widgetId);
  }
});

// 处理模态框确认
const handleModalOk = () => {
  if (getResponse()) {
    // 验证成功，关闭模态框
    hide();
  } else {
    $notification.warning({
      title: '验证失败',
      content: '请先完成人机验证',
    });
  }
};

// 处理模态框取消
const handleModalCancel = () => {
  hide();
  reset(); // 重置验证组件
};
</script>

<style scoped lang="scss">

.turnstile-container {
  min-height: 65px; /* Turnstile 默认高度 */
}
</style>
