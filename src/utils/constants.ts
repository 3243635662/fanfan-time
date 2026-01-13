// localStorage 键名常量
export const STORAGE_KEYS = {
  // 认证相关
  TOKEN: 'token',
  TOKEN_EXPIRY: 'tokenExpiry',
  USER: 'user',
  
  // 设置相关
  PREFERRED_FONT: 'preferredFont',
  IS_DARK_MODE: 'isDark',
  PREFERRED_FONT_SIZE: 'preferredFontSize',
} as const

// 应用基础键名前缀
export const APP_PREFIX = 'fanfan-time'

// Token有效期常量（毫秒）
export const TOKEN_EXPIRY_24H = 24 * 60 * 60 * 1000 // 24小时
