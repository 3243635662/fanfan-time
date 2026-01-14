// 时间格式化函数
export const formatTime = (time: Date | string) => {
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}
