import { Message } from '@arco-design/web-vue';
import type { MessageReturn } from '@arco-design/web-vue/es/message/interface';

// 这里可以定义你想要的默认配置
const DEFAULT_CONFIG = {
  duration: 3000,
  closable: true, // 统一开启可关闭按钮
  position: 'top',
};

// 定义 Message 的类型，保持和 Arco 一致的 TS 体验
export const useMessage = () => {
  const success = (content: string, duration?: number): MessageReturn => {
    return Message.success({
      content,
      duration: duration || DEFAULT_CONFIG.duration,
      closable: DEFAULT_CONFIG.closable,
    });
  };

  const error = (content: string, duration?: number): MessageReturn => {
    return Message.error({
      content,
      duration: duration || DEFAULT_CONFIG.duration,
      closable: DEFAULT_CONFIG.closable,
    });
  };

  const warning = (content: string, duration?: number): MessageReturn => {
    return Message.warning({
      content,
      duration: duration || DEFAULT_CONFIG.duration,
      closable: DEFAULT_CONFIG.closable,
    });
  };

  const info = (content: string, duration?: number): MessageReturn => {
    return Message.info({
      content,
      duration: duration || DEFAULT_CONFIG.duration,
      closable: DEFAULT_CONFIG.closable,
    });
  };

  // 也可以暴露原始 Message 以备不时之需
  const originMessage = Message;

  return {
    success,
    error,
    warning,
    info,
    originMessage
  };
};

// 如果你不想每次都调用 useMessage()，也可以直接导出一个静态对象
export const $message = useMessage();
