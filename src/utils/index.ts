// 秒级别时间格式化函数
export const formatTime = (time: Date | string | undefined | null) => {
  if (!time) return ''
  const date = new Date(time)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleString('zh-CN')
}

// 日级别时间格式化函数
export const formatDate = (time: Date | string | undefined | null) => {
  if (!time) return ''
  const date = new Date(time)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('zh-CN')
}
