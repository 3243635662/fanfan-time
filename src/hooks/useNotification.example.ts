// useNotification 使用示例

import { useNotification, $notification } from '@/hooks/useNotification';

// 方式1: 使用 useNotification 函数
const notification = useNotification();

// 基础用法
notification.success({
  title: '操作成功',
  content: '数据已保存'
});

notification.error({
  title: '操作失败', 
  content: '请检查网络连接'
});

notification.warning({
  title: '注意',
  content: '此操作不可撤销'
});

notification.info({
  title: '提示',
  content: '新功能已上线'
});

// 方式2: 使用 $notification 静态对象（推荐）
$notification.success({
  title: '登录成功',
  content: '欢迎回来！'
});

$notification.error({
  title: '登录失败',
  content: '用户名或密码错误'
});

// 简化用法
$notification.notify('success', '操作完成');
$notification.notify('error', '出错了', '详细信息');

// 高级配置
$notification.success({
  title: '自定义配置',
  content: '这条通知会在左上角显示，5秒后自动关闭',
  position: 'topLeft', // 正确类型: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  duration: 5000,
  closable: true,
  showIcon: true
});

// 不带图标
$notification.info({
  title: '无图标提示',
  content: '这条通知没有图标',
  showIcon: false
});

// 不可关闭
$notification.warning({
  title: '重要警告',
  content: '这条通知不会自动关闭',
  duration: 0,
  closable: false
});
