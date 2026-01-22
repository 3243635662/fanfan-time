import { Notification } from '@arco-design/web-vue';
import type { NotificationReturn, NotificationPosition } from '@arco-design/web-vue/es/notification/interface';

// 默认配置
const DEFAULT_CONFIG = {
  duration: 4000,
  closable: true,
  position: 'topRight' as const,
  showIcon: true,
};

// 定义 Notification 的类型，保持和 Arco 一致的 TS 体验
export const useNotification = () => {
  const success = (options: {
    title: string;
    content?: string;
    duration?: number;
    closable?: boolean;
    position?: NotificationPosition;
    showIcon?: boolean;
  }): NotificationReturn => {
    return Notification.success({
      title: options.title,
      content: options.content || '',
      duration: options.duration || DEFAULT_CONFIG.duration,
      closable: options.closable ?? DEFAULT_CONFIG.closable,
      position: options.position || DEFAULT_CONFIG.position,
      showIcon: options.showIcon ?? DEFAULT_CONFIG.showIcon,
    });
  };

  const error = (options: {
    title: string;
    content?: string;
    duration?: number;
    closable?: boolean;
    position?: NotificationPosition;
    showIcon?: boolean;
  }): NotificationReturn => {
    return Notification.error({
      title: options.title,
      content: options.content || '',
      duration: options.duration || DEFAULT_CONFIG.duration,
      closable: options.closable ?? DEFAULT_CONFIG.closable,
      position: options.position || DEFAULT_CONFIG.position,
      showIcon: options.showIcon ?? DEFAULT_CONFIG.showIcon,
    });
  };

  const warning = (options: {
    title: string;
    content?: string;
    duration?: number;
    closable?: boolean;
    position?: NotificationPosition;
    showIcon?: boolean;
  }): NotificationReturn => {
    return Notification.warning({
      title: options.title,
      content: options.content || '',
      duration: options.duration || DEFAULT_CONFIG.duration,
      closable: options.closable ?? DEFAULT_CONFIG.closable,
      position: options.position || DEFAULT_CONFIG.position,
      showIcon: options.showIcon ?? DEFAULT_CONFIG.showIcon,
    });
  };

  const info = (options: {
    title: string;
    content?: string;
    duration?: number;
    closable?: boolean;
    position?: NotificationPosition;
    showIcon?: boolean;
  }): NotificationReturn => {
    return Notification.info({
      title: options.title,
      content: options.content || '',
      duration: options.duration || DEFAULT_CONFIG.duration,
      closable: options.closable ?? DEFAULT_CONFIG.closable,
      position: options.position || DEFAULT_CONFIG.position,
      showIcon: options.showIcon ?? DEFAULT_CONFIG.showIcon,
    });
  };

  // 简化的通知方法（只有标题和内容）
  const notify = (type: 'success' | 'error' | 'warning' | 'info', title: string, content?: string): NotificationReturn => {
    const method = type === 'success' ? success :
      type === 'error' ? error :
        type === 'warning' ? warning : info;
    return method({ title, content });
  };

  // 也可以暴露原始 Notification 以备不时之需
  const originNotification = Notification;

  return {
    success,
    error,
    warning,
    info,
    notify,
    originNotification
  };
};

// 如果你不想每次都调用 useNotification()，也可以直接导出一个静态对象
export const $notification = useNotification();
